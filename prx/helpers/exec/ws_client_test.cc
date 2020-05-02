#include "prx/helpers/json.hh"
#include "prx/helpers/ws_client.hh"

#include <chrono>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <string>

using ws_client::WebSocket;

nlohmann::json create_box(std::string name, std::string color)
{
    nlohmann::json j1 = {{"name", name}, {"type", "box"}, {"dims", {1, 1, 1}}, {"color", color}};
    return j1;
}

nlohmann::json create_sphere(std::string name)
{
    nlohmann::json j1 = {{"name", name}, {"type", "sphere"}, {"radius", .5}, {"color", "red"}};
    return j1;
}

nlohmann::json create_cylinder(std::string name)
{
    nlohmann::json j1 = {
      {"name", name}, {"type", "cylinder"}, {"radius", .5}, {"height", 2.0}, {"color", "green"}};
    return j1;
}

nlohmann::json create_line(std::string name, const std::vector<std::vector<double>> &line_points)
{
    nlohmann::json j1 = {{"name", name}, {"type", "line"}, {"points", nlohmann::json::array()}};
    for (const auto &point : line_points)
    {
        j1["points"].push_back({point[0], point[1], point[2]});
    }
    return j1;
}

nlohmann::json create_pose(
  std::string name, double x, double y, double z, double qx, double qy, double qz, double qw)
{
    nlohmann::json j1 = {
      {"name", name}, {"position", {x, y, z}}, {"orientation", {qx, qy, qz, qw}}};
    return j1;
}

std::vector<double> heatmap_value(double val)
{
    const std::vector<double> r_vals = {165, 215, 244, 253, 254, 224, 171, 116, 69, 49};
    const std::vector<double> g_vals = {0, 48, 109, 174, 224, 243, 217, 173, 117, 54};
    const std::vector<double> b_vals = {38, 39, 67, 97, 144, 248, 233, 209, 180, 149};

    const double d_index     = std::min(val * 10.0, 10.0);
    const int    lower_index = std::min(std::floor(d_index), 9.0);
    const int    ceil_index  = std::min(std::ceil(d_index), 9.0);

    return {(r_vals[lower_index] * (1.0 - (d_index - lower_index)) +
             r_vals[ceil_index] * ((d_index - lower_index))) /
              255.0,
            (g_vals[lower_index] * (1.0 - (d_index - lower_index)) +
             g_vals[ceil_index] * ((d_index - lower_index))) /
              255.0,
            (b_vals[lower_index] * (1.0 - (d_index - lower_index)) +
             b_vals[ceil_index] * ((d_index - lower_index))) /
              255.0};
}

std::string rgb_to_string(std::vector<double> values)
{
    std::stringstream stream;
    stream << "#";
    stream << std::setfill('0') << std::setw(2) << std::hex << (int)(values[0] * 255);
    stream << std::setfill('0') << std::setw(2) << std::hex << (int)(values[1] * 255);
    stream << std::setfill('0') << std::setw(2) << std::hex << (int)(values[2] * 255);
    return stream.str();
}

int main()
{
    nlohmann::json position_update;
    position_update["geometries"] = {};
    position_update["geometries"].push_back(create_box("box1", "blue"));
    position_update["geometries"].push_back(create_sphere("ball1"));
    position_update["geometries"].push_back(create_cylinder("cylinder1"));

    double radius  = 5;
    double radius2 = 10;

    double b1 = 0, b2 = 0, b3 = 4, b4 = 0, b5 = 0, b6 = 0, b7 = 1;
    double s1 = radius, s2 = 0, s3 = 4, s4 = 0, s5 = 0, s6 = 0, s7 = 1;
    double c1 = radius2, c2 = 0, c3 = 4, c4 = 0, c5 = 0, c6 = 0, c7 = 1;

    std::unique_ptr<WebSocket> ws(WebSocket::from_url("ws://localhost:9999/prx"));

    bool paused = true;

    const auto send_info = [&ws](auto &json_msg) {
        auto message = nlohmann::json::to_bson(json_msg);
        ws->poll();
        ws->sendBinary(message);
        json_msg.clear();
    };

    const auto handle_message = [&paused](const auto data) {
        auto js_input = nlohmann::json::from_bson(data);
        if (js_input["paused"] != paused)
        {
            paused = js_input["paused"];
        }
    };

    const auto receive_info = [&handle_message, &ws]() {
        ws->poll();
        ws->dispatchBinary(handle_message);
    };

    double current_theta = 0;
    double delta         = 0.1;
    double delta_ms      = 40;
    double elapsed_ms    = delta_ms;

    auto end_loop_time   = std::chrono::system_clock::now();
    auto start_loop_time = std::chrono::system_clock::now();

    std::vector<std::vector<double>> points;

    double line_z = 0;

    while (true)
    {
        start_loop_time = std::chrono::system_clock::now();
        receive_info();
        if (!paused)
        {
            if (elapsed_ms >= delta_ms)
            {
                elapsed_ms -= delta_ms;
                line_z += delta_ms / 1000;
                b6 = sin(current_theta / 2);
                b7 = cos(current_theta / 2);

                s1 = radius * cos(current_theta);
                s2 = radius * sin(current_theta);
                s3 = line_z;
                s6 = sin(current_theta / 2);
                s7 = cos(current_theta / 2);

                c1 = radius2 * cos(current_theta);
                c2 = radius2 * sin(current_theta);
                c6 = sin(current_theta / 2);
                c7 = cos(current_theta / 2);

                position_update["poses"] = {};
                position_update["poses"].push_back(create_pose("box1", b1, b2, b3, b4, b5, b6, b7));
                position_update["poses"].push_back(
                  create_pose("ball1", s1, s2, s3, s4, s5, s6, s7));
                position_update["poses"].push_back(
                  create_pose("cylinder1", c1, c2, c3, c4, c5, c6, c7));

                points.push_back({s1, s2, line_z});

                send_info(position_update);

                position_update["geometries"] = {};
                position_update["geometries"].push_back(create_line("line1", points));
                position_update["geometries"].push_back(
                  create_box("box1", rgb_to_string(heatmap_value((c1 + radius2) / (2 * radius2)))));

                // update state
                current_theta += delta;
            }
            end_loop_time = std::chrono::system_clock::now();
            elapsed_ms +=
              std::chrono::duration<double>(end_loop_time - start_loop_time).count() * 1000;
        }
    }

    return 0;
}