
cc_library(
    name = "helpers",
    srcs = glob(["*.cc"]),
    hdrs = glob(["*.hh"]),
    linkstatic = 1,
    visibility = ["//visibility:public"]
)

cc_binary(
    name = "ws_client_test",
    srcs = glob(["exec/ws_client_test.cc"]),
    deps = [
        ":helpers"
    ],
)