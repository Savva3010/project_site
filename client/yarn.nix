{ fetchurl, fetchgit, linkFarm, runCommand, gnutar }: rec {
  offline_cache = linkFarm "offline" packages;
  packages = [
    {
      name = "_babel_code_frame___code_frame_7.26.2.tgz";
      path = fetchurl {
        name = "_babel_code_frame___code_frame_7.26.2.tgz";
        url  = "https://registry.yarnpkg.com/@babel/code-frame/-/code-frame-7.26.2.tgz";
        sha512 = "RJlIHRueQgwWitWgF8OdFYGZX328Ax5BCemNGlqHfplnRT9ESi8JkFlvaVYbS+UubVY6dpv87Fs2u5M29iNFVQ==";
      };
    }
    {
      name = "_babel_generator___generator_7.26.9.tgz";
      path = fetchurl {
        name = "_babel_generator___generator_7.26.9.tgz";
        url  = "https://registry.yarnpkg.com/@babel/generator/-/generator-7.26.9.tgz";
        sha512 = "kEWdzjOAUMW4hAyrzJ0ZaTOu9OmpyDIQicIh0zg0EEcEkYXZb2TjtBhnHi2ViX7PKwZqF4xwqfAm299/QMP3lg==";
      };
    }
    {
      name = "_babel_helper_module_imports___helper_module_imports_7.25.9.tgz";
      path = fetchurl {
        name = "_babel_helper_module_imports___helper_module_imports_7.25.9.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-module-imports/-/helper-module-imports-7.25.9.tgz";
        sha512 = "tnUA4RsrmflIM6W6RFTLFSXITtl0wKjgpnLgXyowocVPrbYrLUXSBXDgTs8BlbmIzIdlBySRQjINYs2BAkiLtw==";
      };
    }
    {
      name = "_babel_helper_plugin_utils___helper_plugin_utils_7.26.5.tgz";
      path = fetchurl {
        name = "_babel_helper_plugin_utils___helper_plugin_utils_7.26.5.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-plugin-utils/-/helper-plugin-utils-7.26.5.tgz";
        sha512 = "RS+jZcRdZdRFzMyr+wcsaqOmld1/EqTghfaBGQQd/WnRdzdlvSZ//kF7U8VQTxf1ynZ4cjUcYgjVGx13ewNPMg==";
      };
    }
    {
      name = "_babel_helper_string_parser___helper_string_parser_7.25.9.tgz";
      path = fetchurl {
        name = "_babel_helper_string_parser___helper_string_parser_7.25.9.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-string-parser/-/helper-string-parser-7.25.9.tgz";
        sha512 = "4A/SCr/2KLd5jrtOMFzaKjVtAei3+2r/NChoBNoZ3EyP/+GlhoaEGoWOZUmFmoITP7zOJyHIMm+DYRd8o3PvHA==";
      };
    }
    {
      name = "_babel_helper_validator_identifier___helper_validator_identifier_7.25.9.tgz";
      path = fetchurl {
        name = "_babel_helper_validator_identifier___helper_validator_identifier_7.25.9.tgz";
        url  = "https://registry.yarnpkg.com/@babel/helper-validator-identifier/-/helper-validator-identifier-7.25.9.tgz";
        sha512 = "Ed61U6XJc3CVRfkERJWDz4dJwKe7iLmmJsbOGu9wSloNSFttHV0I8g6UAgb7qnK5ly5bGLPd4oXZlxCdANBOWQ==";
      };
    }
    {
      name = "_babel_parser___parser_7.26.9.tgz";
      path = fetchurl {
        name = "_babel_parser___parser_7.26.9.tgz";
        url  = "https://registry.yarnpkg.com/@babel/parser/-/parser-7.26.9.tgz";
        sha512 = "81NWa1njQblgZbQHxWHpxxCzNsa3ZwvFqpUg7P+NNUU6f3UU2jBEg4OlF/J6rl8+PQGh1q6/zWScd001YwcA5A==";
      };
    }
    {
      name = "_babel_template___template_7.26.9.tgz";
      path = fetchurl {
        name = "_babel_template___template_7.26.9.tgz";
        url  = "https://registry.yarnpkg.com/@babel/template/-/template-7.26.9.tgz";
        sha512 = "qyRplbeIpNZhmzOysF/wFMuP9sctmh2cFzRAZOn1YapxBsE1i9bJIY586R/WBLfLcmcBlM8ROBiQURnnNy+zfA==";
      };
    }
    {
      name = "_babel_traverse___traverse_7.26.9.tgz";
      path = fetchurl {
        name = "_babel_traverse___traverse_7.26.9.tgz";
        url  = "https://registry.yarnpkg.com/@babel/traverse/-/traverse-7.26.9.tgz";
        sha512 = "ZYW7L+pL8ahU5fXmNbPF+iZFHCv5scFak7MZ9bwaRPLUhHh7QQEMjZUg0HevihoqCM5iSYHN61EyCoZvqC+bxg==";
      };
    }
    {
      name = "_babel_types___types_7.26.9.tgz";
      path = fetchurl {
        name = "_babel_types___types_7.26.9.tgz";
        url  = "https://registry.yarnpkg.com/@babel/types/-/types-7.26.9.tgz";
        sha512 = "Y3IR1cRnOxOCDvMmNiym7XpXQ93iGDDPHx+Zj+NM+rg0fBaShfQLkg+hKPaZCEvg5N/LeCo4+Rj/i3FuJsIQaw==";
      };
    }
    {
      name = "_jridgewell_gen_mapping___gen_mapping_0.3.8.tgz";
      path = fetchurl {
        name = "_jridgewell_gen_mapping___gen_mapping_0.3.8.tgz";
        url  = "https://registry.yarnpkg.com/@jridgewell/gen-mapping/-/gen-mapping-0.3.8.tgz";
        sha512 = "imAbBGkb+ebQyxKgzv5Hu2nmROxoDOXHh80evxdoXNOrvAnVx7zimzc1Oo5h9RlfV4vPXaE2iM5pOFbvOCClWA==";
      };
    }
    {
      name = "_jridgewell_resolve_uri___resolve_uri_3.1.2.tgz";
      path = fetchurl {
        name = "_jridgewell_resolve_uri___resolve_uri_3.1.2.tgz";
        url  = "https://registry.yarnpkg.com/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz";
        sha512 = "bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==";
      };
    }
    {
      name = "_jridgewell_set_array___set_array_1.2.1.tgz";
      path = fetchurl {
        name = "_jridgewell_set_array___set_array_1.2.1.tgz";
        url  = "https://registry.yarnpkg.com/@jridgewell/set-array/-/set-array-1.2.1.tgz";
        sha512 = "R8gLRTZeyp03ymzP/6Lil/28tGeGEzhx1q2k703KGWRAI1VdvPIXdG70VJc2pAMw3NA6JKL5hhFu1sJX0Mnn/A==";
      };
    }
    {
      name = "_jridgewell_sourcemap_codec___sourcemap_codec_1.5.0.tgz";
      path = fetchurl {
        name = "_jridgewell_sourcemap_codec___sourcemap_codec_1.5.0.tgz";
        url  = "https://registry.yarnpkg.com/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.0.tgz";
        sha512 = "gv3ZRaISU3fjPAgNsriBRqGWQL6quFx04YMPW/zD8XMLsU32mhCCbfbO6KZFLjvYpCZ8zyDEgqsgf+PwPaM7GQ==";
      };
    }
    {
      name = "_jridgewell_trace_mapping___trace_mapping_0.3.25.tgz";
      path = fetchurl {
        name = "_jridgewell_trace_mapping___trace_mapping_0.3.25.tgz";
        url  = "https://registry.yarnpkg.com/@jridgewell/trace-mapping/-/trace-mapping-0.3.25.tgz";
        sha512 = "vNk6aEwybGtawWmy/PzwnGDOjCkLWSD2wqvjGGAgOAwCGWySYXfYoxt00IJkTF+8Lb57DwOb3Aa0o9CApepiYQ==";
      };
    }
    {
      name = "_next_env___env_14.2.24.tgz";
      path = fetchurl {
        name = "_next_env___env_14.2.24.tgz";
        url  = "https://registry.yarnpkg.com/@next/env/-/env-14.2.24.tgz";
        sha512 = "LAm0Is2KHTNT6IT16lxT+suD0u+VVfYNQqM+EJTKuFRRuY2z+zj01kueWXPCxbMBDt0B5vONYzabHGUNbZYAhA==";
      };
    }
    {
      name = "_next_swc_darwin_arm64___swc_darwin_arm64_14.2.24.tgz";
      path = fetchurl {
        name = "_next_swc_darwin_arm64___swc_darwin_arm64_14.2.24.tgz";
        url  = "https://registry.yarnpkg.com/@next/swc-darwin-arm64/-/swc-darwin-arm64-14.2.24.tgz";
        sha512 = "7Tdi13aojnAZGpapVU6meVSpNzgrFwZ8joDcNS8cJVNuP3zqqrLqeory9Xec5TJZR/stsGJdfwo8KeyloT3+rQ==";
      };
    }
    {
      name = "_next_swc_darwin_x64___swc_darwin_x64_14.2.24.tgz";
      path = fetchurl {
        name = "_next_swc_darwin_x64___swc_darwin_x64_14.2.24.tgz";
        url  = "https://registry.yarnpkg.com/@next/swc-darwin-x64/-/swc-darwin-x64-14.2.24.tgz";
        sha512 = "lXR2WQqUtu69l5JMdTwSvQUkdqAhEWOqJEYUQ21QczQsAlNOW2kWZCucA6b3EXmPbcvmHB1kSZDua/713d52xg==";
      };
    }
    {
      name = "_next_swc_linux_arm64_gnu___swc_linux_arm64_gnu_14.2.24.tgz";
      path = fetchurl {
        name = "_next_swc_linux_arm64_gnu___swc_linux_arm64_gnu_14.2.24.tgz";
        url  = "https://registry.yarnpkg.com/@next/swc-linux-arm64-gnu/-/swc-linux-arm64-gnu-14.2.24.tgz";
        sha512 = "nxvJgWOpSNmzidYvvGDfXwxkijb6hL9+cjZx1PVG6urr2h2jUqBALkKjT7kpfurRWicK6hFOvarmaWsINT1hnA==";
      };
    }
    {
      name = "_next_swc_linux_arm64_musl___swc_linux_arm64_musl_14.2.24.tgz";
      path = fetchurl {
        name = "_next_swc_linux_arm64_musl___swc_linux_arm64_musl_14.2.24.tgz";
        url  = "https://registry.yarnpkg.com/@next/swc-linux-arm64-musl/-/swc-linux-arm64-musl-14.2.24.tgz";
        sha512 = "PaBgOPhqa4Abxa3y/P92F3kklNPsiFjcjldQGT7kFmiY5nuFn8ClBEoX8GIpqU1ODP2y8P6hio6vTomx2Vy0UQ==";
      };
    }
    {
      name = "_next_swc_linux_x64_gnu___swc_linux_x64_gnu_14.2.24.tgz";
      path = fetchurl {
        name = "_next_swc_linux_x64_gnu___swc_linux_x64_gnu_14.2.24.tgz";
        url  = "https://registry.yarnpkg.com/@next/swc-linux-x64-gnu/-/swc-linux-x64-gnu-14.2.24.tgz";
        sha512 = "vEbyadiRI7GOr94hd2AB15LFVgcJZQWu7Cdi9cWjCMeCiUsHWA0U5BkGPuoYRnTxTn0HacuMb9NeAmStfBCLoQ==";
      };
    }
    {
      name = "_next_swc_linux_x64_musl___swc_linux_x64_musl_14.2.24.tgz";
      path = fetchurl {
        name = "_next_swc_linux_x64_musl___swc_linux_x64_musl_14.2.24.tgz";
        url  = "https://registry.yarnpkg.com/@next/swc-linux-x64-musl/-/swc-linux-x64-musl-14.2.24.tgz";
        sha512 = "df0FC9ptaYsd8nQCINCzFtDWtko8PNRTAU0/+d7hy47E0oC17tI54U/0NdGk7l/76jz1J377dvRjmt6IUdkpzQ==";
      };
    }
    {
      name = "_next_swc_win32_arm64_msvc___swc_win32_arm64_msvc_14.2.24.tgz";
      path = fetchurl {
        name = "_next_swc_win32_arm64_msvc___swc_win32_arm64_msvc_14.2.24.tgz";
        url  = "https://registry.yarnpkg.com/@next/swc-win32-arm64-msvc/-/swc-win32-arm64-msvc-14.2.24.tgz";
        sha512 = "ZEntbLjeYAJ286eAqbxpZHhDFYpYjArotQ+/TW9j7UROh0DUmX7wYDGtsTPpfCV8V+UoqHBPU7q9D4nDNH014Q==";
      };
    }
    {
      name = "_next_swc_win32_ia32_msvc___swc_win32_ia32_msvc_14.2.24.tgz";
      path = fetchurl {
        name = "_next_swc_win32_ia32_msvc___swc_win32_ia32_msvc_14.2.24.tgz";
        url  = "https://registry.yarnpkg.com/@next/swc-win32-ia32-msvc/-/swc-win32-ia32-msvc-14.2.24.tgz";
        sha512 = "9KuS+XUXM3T6v7leeWU0erpJ6NsFIwiTFD5nzNg8J5uo/DMIPvCp3L1Ao5HjbHX0gkWPB1VrKoo/Il4F0cGK2Q==";
      };
    }
    {
      name = "_next_swc_win32_x64_msvc___swc_win32_x64_msvc_14.2.24.tgz";
      path = fetchurl {
        name = "_next_swc_win32_x64_msvc___swc_win32_x64_msvc_14.2.24.tgz";
        url  = "https://registry.yarnpkg.com/@next/swc-win32-x64-msvc/-/swc-win32-x64-msvc-14.2.24.tgz";
        sha512 = "cXcJ2+x0fXQ2CntaE00d7uUH+u1Bfp/E0HsNQH79YiLaZE5Rbm7dZzyAYccn3uICM7mw+DxoMqEfGXZtF4Fgaw==";
      };
    }
    {
      name = "_preact_signals_core___signals_core_1.8.0.tgz";
      path = fetchurl {
        name = "_preact_signals_core___signals_core_1.8.0.tgz";
        url  = "https://registry.yarnpkg.com/@preact/signals-core/-/signals-core-1.8.0.tgz";
        sha512 = "OBvUsRZqNmjzCZXWLxkZfhcgT+Fk8DDcT/8vD6a1xhDemodyy87UJRJfASMuSD8FaAIeGgGm85ydXhm7lr4fyA==";
      };
    }
    {
      name = "_preact_signals_react_transform___signals_react_transform_0.4.0.tgz";
      path = fetchurl {
        name = "_preact_signals_react_transform___signals_react_transform_0.4.0.tgz";
        url  = "https://registry.yarnpkg.com/@preact/signals-react-transform/-/signals-react-transform-0.4.0.tgz";
        sha512 = "ZH8u5VrFPMmxggjAr7Rl9OLi3yvyDGi4lGQulftkszuiJB15jVy/MMraIfNvWKf2RfjtHLvp3K6Jk19xO/j7Tw==";
      };
    }
    {
      name = "_preact_signals_react___signals_react_2.3.0.tgz";
      path = fetchurl {
        name = "_preact_signals_react___signals_react_2.3.0.tgz";
        url  = "https://registry.yarnpkg.com/@preact/signals-react/-/signals-react-2.3.0.tgz";
        sha512 = "g77rc7gTuPaoS5Lr80wjbN9P0t2U+YqJ6NG2krF5KLWLIoGn4uiByOv4bcZSJ41E4Nj50JLuXvdQEGlpU6cOug==";
      };
    }
    {
      name = "_preact_signals___signals_1.3.2.tgz";
      path = fetchurl {
        name = "_preact_signals___signals_1.3.2.tgz";
        url  = "https://registry.yarnpkg.com/@preact/signals/-/signals-1.3.2.tgz";
        sha512 = "naxcJgUJ6BTOROJ7C3QML7KvwKwCXQJYTc5L/b0eEsdYgPB6SxwoQ1vDGcS0Q7GVjAenVq/tXrybVdFShHYZWg==";
      };
    }
    {
      name = "_remix_run_router___router_1.23.0.tgz";
      path = fetchurl {
        name = "_remix_run_router___router_1.23.0.tgz";
        url  = "https://registry.yarnpkg.com/@remix-run/router/-/router-1.23.0.tgz";
        sha512 = "O3rHJzAQKamUz1fvE0Qaw0xSFqsA/yafi2iqeE0pvdFtCO1viYx8QL6f3Ln/aCCTLxs68SLf0KPM9eSeM8yBnA==";
      };
    }
    {
      name = "_swc_counter___counter_0.1.3.tgz";
      path = fetchurl {
        name = "_swc_counter___counter_0.1.3.tgz";
        url  = "https://registry.yarnpkg.com/@swc/counter/-/counter-0.1.3.tgz";
        sha512 = "e2BR4lsJkkRlKZ/qCHPw9ZaSxc0MVUd7gtbtaB7aMvHeJVYe8sOB8DBZkP2DtISHGSku9sCK6T6cnY0CtXrOCQ==";
      };
    }
    {
      name = "_swc_helpers___helpers_0.5.5.tgz";
      path = fetchurl {
        name = "_swc_helpers___helpers_0.5.5.tgz";
        url  = "https://registry.yarnpkg.com/@swc/helpers/-/helpers-0.5.5.tgz";
        sha512 = "KGYxvIOXcceOAbEk4bi/dVLEK9z8sZ0uBB3Il5b1rhfClSpcX0yfRO0KmTkqR2cnQDymwLB+25ZyMzICg/cm/A==";
      };
    }
    {
      name = "_types_cookie___cookie_0.6.0.tgz";
      path = fetchurl {
        name = "_types_cookie___cookie_0.6.0.tgz";
        url  = "https://registry.yarnpkg.com/@types/cookie/-/cookie-0.6.0.tgz";
        sha512 = "4Kh9a6B2bQciAhf7FSuMRRkUWecJgJu9nPnx3yzpsfXX/c50REIqpHY4C82bXP90qrLtXtkDxTZosYO3UpOwlA==";
      };
    }
    {
      name = "_types_hoist_non_react_statics___hoist_non_react_statics_3.3.6.tgz";
      path = fetchurl {
        name = "_types_hoist_non_react_statics___hoist_non_react_statics_3.3.6.tgz";
        url  = "https://registry.yarnpkg.com/@types/hoist-non-react-statics/-/hoist-non-react-statics-3.3.6.tgz";
        sha512 = "lPByRJUer/iN/xa4qpyL0qmL11DqNW81iU/IG1S3uvRUq4oKagz8VCxZjiWkumgt66YT3vOdDgZ0o32sGKtCEw==";
      };
    }
    {
      name = "_types_json_schema___json_schema_7.0.15.tgz";
      path = fetchurl {
        name = "_types_json_schema___json_schema_7.0.15.tgz";
        url  = "https://registry.yarnpkg.com/@types/json-schema/-/json-schema-7.0.15.tgz";
        sha512 = "5+fP8P8MFNC+AyZCDxrB2pkZFPGzqQWUzpSeuuVLvm8VMcorNYavBqoFcxK8bQz4Qsbn4oUEEem4wDLfcysGHA==";
      };
    }
    {
      name = "_types_react___react_19.0.10.tgz";
      path = fetchurl {
        name = "_types_react___react_19.0.10.tgz";
        url  = "https://registry.yarnpkg.com/@types/react/-/react-19.0.10.tgz";
        sha512 = "JuRQ9KXLEjaUNjTWpzuR231Z2WpIwczOkBEIvbHNCzQefFIT0L8IqE6NV6ULLyC1SI/i234JnDoMkfg+RjQj2g==";
      };
    }
    {
      name = "ajv_keywords___ajv_keywords_3.5.2.tgz";
      path = fetchurl {
        name = "ajv_keywords___ajv_keywords_3.5.2.tgz";
        url  = "https://registry.yarnpkg.com/ajv-keywords/-/ajv-keywords-3.5.2.tgz";
        sha512 = "5p6WTN0DdTGVQk6VjcEju19IgaHudalcfabD7yhDGeA6bcQnmL+CpveLJq/3hvfwd1aof6L386Ougkx6RfyMIQ==";
      };
    }
    {
      name = "ajv___ajv_6.12.6.tgz";
      path = fetchurl {
        name = "ajv___ajv_6.12.6.tgz";
        url  = "https://registry.yarnpkg.com/ajv/-/ajv-6.12.6.tgz";
        sha512 = "j3fVLgvTo527anyYyJOGTYJbG+vnnQYvE0m5mmkc1TK+nxAppkCLMIL0aZ4dblVCNoGShhm+kzE4ZUykBoMg4g==";
      };
    }
    {
      name = "big.js___big.js_5.2.2.tgz";
      path = fetchurl {
        name = "big.js___big.js_5.2.2.tgz";
        url  = "https://registry.yarnpkg.com/big.js/-/big.js-5.2.2.tgz";
        sha512 = "vyL2OymJxmarO8gxMr0mhChsO9QGwhynfuu4+MHTAW6czfq9humCB7rKpUjDd9YUiDPU4mzpyupFSvOClAwbmQ==";
      };
    }
    {
      name = "blurhash___blurhash_2.0.5.tgz";
      path = fetchurl {
        name = "blurhash___blurhash_2.0.5.tgz";
        url  = "https://registry.yarnpkg.com/blurhash/-/blurhash-2.0.5.tgz";
        sha512 = "cRygWd7kGBQO3VEhPiTgq4Wc43ctsM+o46urrmPOiuAe+07fzlSB9OJVdpgDL0jPqXUVQ9ht7aq7kxOeJHRK+w==";
      };
    }
    {
      name = "bootstrap_icons___bootstrap_icons_1.11.3.tgz";
      path = fetchurl {
        name = "bootstrap_icons___bootstrap_icons_1.11.3.tgz";
        url  = "https://registry.yarnpkg.com/bootstrap-icons/-/bootstrap-icons-1.11.3.tgz";
        sha512 = "+3lpHrCw/it2/7lBL15VR0HEumaBss0+f/Lb6ZvHISn1mlK83jjFpooTLsMWbIjJMDjDjOExMsTxnXSIT4k4ww==";
      };
    }
    {
      name = "bootstrap___bootstrap_5.3.3.tgz";
      path = fetchurl {
        name = "bootstrap___bootstrap_5.3.3.tgz";
        url  = "https://registry.yarnpkg.com/bootstrap/-/bootstrap-5.3.3.tgz";
        sha512 = "8HLCdWgyoMguSO9o+aH+iuZ+aht+mzW0u3HIMzVu7Srrpv7EBBxTnrFlSCskwdY1+EOFQSm7uMJhNQHkdPcmjg==";
      };
    }
    {
      name = "busboy___busboy_1.6.0.tgz";
      path = fetchurl {
        name = "busboy___busboy_1.6.0.tgz";
        url  = "https://registry.yarnpkg.com/busboy/-/busboy-1.6.0.tgz";
        sha512 = "8SFQbg/0hQ9xy3UNTB0YEnsNBbWfhf7RtnzpL7TkBiTBRfrQ9Fxcnz7VJsleJpyp6rVLvXiuORqjlHi5q+PYuA==";
      };
    }
    {
      name = "caniuse_lite___caniuse_lite_1.0.30001701.tgz";
      path = fetchurl {
        name = "caniuse_lite___caniuse_lite_1.0.30001701.tgz";
        url  = "https://registry.yarnpkg.com/caniuse-lite/-/caniuse-lite-1.0.30001701.tgz";
        sha512 = "faRs/AW3jA9nTwmJBSO1PQ6L/EOgsB5HMQQq4iCu5zhPgVVgO/pZRHlmatwijZKetFw8/Pr4q6dEN8sJuq8qTw==";
      };
    }
    {
      name = "client_only___client_only_0.0.1.tgz";
      path = fetchurl {
        name = "client_only___client_only_0.0.1.tgz";
        url  = "https://registry.yarnpkg.com/client-only/-/client-only-0.0.1.tgz";
        sha512 = "IV3Ou0jSMzZrd3pZ48nLkT9DA7Ag1pnPzaiQhpW7c3RbcqqzvzzVu+L8gfqMp/8IM2MQtSiqaCxrrcfu8I8rMA==";
      };
    }
    {
      name = "clsx___clsx_2.1.1.tgz";
      path = fetchurl {
        name = "clsx___clsx_2.1.1.tgz";
        url  = "https://registry.yarnpkg.com/clsx/-/clsx-2.1.1.tgz";
        sha512 = "eYm0QWBtUrBWZWG0d386OGAw16Z995PiOVo2B7bjWSbHedGl5e0ZWaq65kOGgUSNesEIDkB9ISbTg/JK9dhCZA==";
      };
    }
    {
      name = "cookie___cookie_0.7.2.tgz";
      path = fetchurl {
        name = "cookie___cookie_0.7.2.tgz";
        url  = "https://registry.yarnpkg.com/cookie/-/cookie-0.7.2.tgz";
        sha512 = "yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==";
      };
    }
    {
      name = "csstype___csstype_3.1.3.tgz";
      path = fetchurl {
        name = "csstype___csstype_3.1.3.tgz";
        url  = "https://registry.yarnpkg.com/csstype/-/csstype-3.1.3.tgz";
        sha512 = "M1uQkMl8rQK/szD0LNhtqxIPLpimGm8sOBwU7lLnCpSbTyY3yeU1Vc7l4KT5zT4s/yOxHH5O7tIuuLOCnLADRw==";
      };
    }
    {
      name = "debug___debug_4.4.0.tgz";
      path = fetchurl {
        name = "debug___debug_4.4.0.tgz";
        url  = "https://registry.yarnpkg.com/debug/-/debug-4.4.0.tgz";
        sha512 = "6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==";
      };
    }
    {
      name = "emojis_list___emojis_list_3.0.0.tgz";
      path = fetchurl {
        name = "emojis_list___emojis_list_3.0.0.tgz";
        url  = "https://registry.yarnpkg.com/emojis-list/-/emojis-list-3.0.0.tgz";
        sha512 = "/kyM18EfinwXZbno9FyUGeFh87KC8HRQBQGildHZbEuRyWFOmv1U10o9BBp8XVZDVNNuQKyIGIu5ZYAAXJ0V2Q==";
      };
    }
    {
      name = "fast_deep_equal___fast_deep_equal_3.1.3.tgz";
      path = fetchurl {
        name = "fast_deep_equal___fast_deep_equal_3.1.3.tgz";
        url  = "https://registry.yarnpkg.com/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz";
        sha512 = "f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==";
      };
    }
    {
      name = "fast_json_stable_stringify___fast_json_stable_stringify_2.1.0.tgz";
      path = fetchurl {
        name = "fast_json_stable_stringify___fast_json_stable_stringify_2.1.0.tgz";
        url  = "https://registry.yarnpkg.com/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz";
        sha512 = "lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==";
      };
    }
    {
      name = "globals___globals_11.12.0.tgz";
      path = fetchurl {
        name = "globals___globals_11.12.0.tgz";
        url  = "https://registry.yarnpkg.com/globals/-/globals-11.12.0.tgz";
        sha512 = "WOBp/EEGUiIsJSp7wcv/y6MO+lV9UoncWqxuFfm8eBwzWNgyfBd6Gz+IeKQ9jCmyhoH99g15M3T+QaVHFjizVA==";
      };
    }
    {
      name = "graceful_fs___graceful_fs_4.2.11.tgz";
      path = fetchurl {
        name = "graceful_fs___graceful_fs_4.2.11.tgz";
        url  = "https://registry.yarnpkg.com/graceful-fs/-/graceful-fs-4.2.11.tgz";
        sha512 = "RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==";
      };
    }
    {
      name = "hoist_non_react_statics___hoist_non_react_statics_3.3.2.tgz";
      path = fetchurl {
        name = "hoist_non_react_statics___hoist_non_react_statics_3.3.2.tgz";
        url  = "https://registry.yarnpkg.com/hoist-non-react-statics/-/hoist-non-react-statics-3.3.2.tgz";
        sha512 = "/gGivxi8JPKWNm/W0jSmzcMPpfpPLc3dY/6GxhX2hQ9iGj3aDfklV4ET7NjKpSinLpJ5vafa9iiGIEZg10SfBw==";
      };
    }
    {
      name = "js_tokens___js_tokens_4.0.0.tgz";
      path = fetchurl {
        name = "js_tokens___js_tokens_4.0.0.tgz";
        url  = "https://registry.yarnpkg.com/js-tokens/-/js-tokens-4.0.0.tgz";
        sha512 = "RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==";
      };
    }
    {
      name = "jsesc___jsesc_3.1.0.tgz";
      path = fetchurl {
        name = "jsesc___jsesc_3.1.0.tgz";
        url  = "https://registry.yarnpkg.com/jsesc/-/jsesc-3.1.0.tgz";
        sha512 = "/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==";
      };
    }
    {
      name = "json_schema_traverse___json_schema_traverse_0.4.1.tgz";
      path = fetchurl {
        name = "json_schema_traverse___json_schema_traverse_0.4.1.tgz";
        url  = "https://registry.yarnpkg.com/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz";
        sha512 = "xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==";
      };
    }
    {
      name = "json5___json5_2.2.3.tgz";
      path = fetchurl {
        name = "json5___json5_2.2.3.tgz";
        url  = "https://registry.yarnpkg.com/json5/-/json5-2.2.3.tgz";
        sha512 = "XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==";
      };
    }
    {
      name = "loader_utils___loader_utils_2.0.4.tgz";
      path = fetchurl {
        name = "loader_utils___loader_utils_2.0.4.tgz";
        url  = "https://registry.yarnpkg.com/loader-utils/-/loader-utils-2.0.4.tgz";
        sha512 = "xXqpXoINfFhgua9xiqD8fPFHgkoq1mmmpE92WlDbm9rNRd/EbRb+Gqf908T2DMfuHjjJlksiK2RbHVOdD/MqSw==";
      };
    }
    {
      name = "loose_envify___loose_envify_1.4.0.tgz";
      path = fetchurl {
        name = "loose_envify___loose_envify_1.4.0.tgz";
        url  = "https://registry.yarnpkg.com/loose-envify/-/loose-envify-1.4.0.tgz";
        sha512 = "lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==";
      };
    }
    {
      name = "mime_db___mime_db_1.52.0.tgz";
      path = fetchurl {
        name = "mime_db___mime_db_1.52.0.tgz";
        url  = "https://registry.yarnpkg.com/mime-db/-/mime-db-1.52.0.tgz";
        sha512 = "sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==";
      };
    }
    {
      name = "mime_types___mime_types_2.1.35.tgz";
      path = fetchurl {
        name = "mime_types___mime_types_2.1.35.tgz";
        url  = "https://registry.yarnpkg.com/mime-types/-/mime-types-2.1.35.tgz";
        sha512 = "ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==";
      };
    }
    {
      name = "ms___ms_2.1.3.tgz";
      path = fetchurl {
        name = "ms___ms_2.1.3.tgz";
        url  = "https://registry.yarnpkg.com/ms/-/ms-2.1.3.tgz";
        sha512 = "6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==";
      };
    }
    {
      name = "nanoid___nanoid_3.3.8.tgz";
      path = fetchurl {
        name = "nanoid___nanoid_3.3.8.tgz";
        url  = "https://registry.yarnpkg.com/nanoid/-/nanoid-3.3.8.tgz";
        sha512 = "WNLf5Sd8oZxOm+TzppcYk8gVOgP+l58xNy58D0nbUnOxOWRWvlcCV4kUF7ltmI6PsrLl/BgKEyS4mqsGChFN0w==";
      };
    }
    {
      name = "next___next_14.2.24.tgz";
      path = fetchurl {
        name = "next___next_14.2.24.tgz";
        url  = "https://registry.yarnpkg.com/next/-/next-14.2.24.tgz";
        sha512 = "En8VEexSJ0Py2FfVnRRh8gtERwDRaJGNvsvad47ShkC2Yi8AXQPXEA2vKoDJlGFSj5WE5SyF21zNi4M5gyi+SQ==";
      };
    }
    {
      name = "picocolors___picocolors_1.1.1.tgz";
      path = fetchurl {
        name = "picocolors___picocolors_1.1.1.tgz";
        url  = "https://registry.yarnpkg.com/picocolors/-/picocolors-1.1.1.tgz";
        sha512 = "xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==";
      };
    }
    {
      name = "postcss___postcss_8.4.31.tgz";
      path = fetchurl {
        name = "postcss___postcss_8.4.31.tgz";
        url  = "https://registry.yarnpkg.com/postcss/-/postcss-8.4.31.tgz";
        sha512 = "PS08Iboia9mts/2ygV3eLpY5ghnUcfLV/EXTOW1E2qYxJKGGBUtNjN76FYHnMs36RmARn41bC0AZmn+rR0OVpQ==";
      };
    }
    {
      name = "punycode___punycode_2.3.1.tgz";
      path = fetchurl {
        name = "punycode___punycode_2.3.1.tgz";
        url  = "https://registry.yarnpkg.com/punycode/-/punycode-2.3.1.tgz";
        sha512 = "vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==";
      };
    }
    {
      name = "react_blurhash___react_blurhash_0.3.0.tgz";
      path = fetchurl {
        name = "react_blurhash___react_blurhash_0.3.0.tgz";
        url  = "https://registry.yarnpkg.com/react-blurhash/-/react-blurhash-0.3.0.tgz";
        sha512 = "XlKr4Ns1iYFRnk6DkAblNbAwN/bTJvxTVoxMvmTcURdc5oLoXZwqAF9N3LZUh/HT+QFlq5n6IS6VsDGsviYAiQ==";
      };
    }
    {
      name = "react_cookie___react_cookie_7.2.2.tgz";
      path = fetchurl {
        name = "react_cookie___react_cookie_7.2.2.tgz";
        url  = "https://registry.yarnpkg.com/react-cookie/-/react-cookie-7.2.2.tgz";
        sha512 = "e+hi6axHcw9VODoeVu8WyMWyoosa1pzpyjfvrLdF7CexfU+WSGZdDuRfHa4RJgTpfv3ZjdIpHE14HpYBieHFhg==";
      };
    }
    {
      name = "react_dom___react_dom_18.3.1.tgz";
      path = fetchurl {
        name = "react_dom___react_dom_18.3.1.tgz";
        url  = "https://registry.yarnpkg.com/react-dom/-/react-dom-18.3.1.tgz";
        sha512 = "5m4nQKp+rZRb09LNH59GM4BxTh9251/ylbKIbpe7TpGxfJ+9kv6BLkLBXIjjspbgbnIBNqlI23tRnTWT0snUIw==";
      };
    }
    {
      name = "react_is___react_is_16.13.1.tgz";
      path = fetchurl {
        name = "react_is___react_is_16.13.1.tgz";
        url  = "https://registry.yarnpkg.com/react-is/-/react-is-16.13.1.tgz";
        sha512 = "24e6ynE2H+OKt4kqsOvNd8kBpV65zoxbA4BVsEOB3ARVWQki/DHzaUoC5KuON/BiccDaCCTZBuOcfZs70kR8bQ==";
      };
    }
    {
      name = "react_router_dom___react_router_dom_6.30.0.tgz";
      path = fetchurl {
        name = "react_router_dom___react_router_dom_6.30.0.tgz";
        url  = "https://registry.yarnpkg.com/react-router-dom/-/react-router-dom-6.30.0.tgz";
        sha512 = "x30B78HV5tFk8ex0ITwzC9TTZMua4jGyA9IUlH1JLQYQTFyxr/ZxwOJq7evg1JX1qGVUcvhsmQSKdPncQrjTgA==";
      };
    }
    {
      name = "react_router___react_router_6.30.0.tgz";
      path = fetchurl {
        name = "react_router___react_router_6.30.0.tgz";
        url  = "https://registry.yarnpkg.com/react-router/-/react-router-6.30.0.tgz";
        sha512 = "D3X8FyH9nBcTSHGdEKurK7r8OYE1kKFn3d/CF+CoxbSHkxU7o37+Uh7eAHRXr6k2tSExXYO++07PeXJtA/dEhQ==";
      };
    }
    {
      name = "react_toastify___react_toastify_10.0.6.tgz";
      path = fetchurl {
        name = "react_toastify___react_toastify_10.0.6.tgz";
        url  = "https://registry.yarnpkg.com/react-toastify/-/react-toastify-10.0.6.tgz";
        sha512 = "yYjp+omCDf9lhZcrZHKbSq7YMuK0zcYkDFTzfRFgTXkTFHZ1ToxwAonzA4JI5CxA91JpjFLmwEsZEgfYfOqI1A==";
      };
    }
    {
      name = "react_use_websocket___react_use_websocket_4.13.0.tgz";
      path = fetchurl {
        name = "react_use_websocket___react_use_websocket_4.13.0.tgz";
        url  = "https://registry.yarnpkg.com/react-use-websocket/-/react-use-websocket-4.13.0.tgz";
        sha512 = "anMuVoV//g2N76Wxqvqjjo1X48r9Np3y1/gMl7arX84tAPXdy5R7sB5lO5hvCzQRYjqXwV8XMAiEBOUbyrZFrw==";
      };
    }
    {
      name = "react___react_18.3.1.tgz";
      path = fetchurl {
        name = "react___react_18.3.1.tgz";
        url  = "https://registry.yarnpkg.com/react/-/react-18.3.1.tgz";
        sha512 = "wS+hAgJShR0KhEvPJArfuPVN1+Hz1t0Y6n5jLrGQbkb4urgPE/0Rve+1kMB1v/oWgHgm4WIcV+i7F2pTVj+2iQ==";
      };
    }
    {
      name = "scheduler___scheduler_0.23.2.tgz";
      path = fetchurl {
        name = "scheduler___scheduler_0.23.2.tgz";
        url  = "https://registry.yarnpkg.com/scheduler/-/scheduler-0.23.2.tgz";
        sha512 = "UOShsPwz7NrMUqhR6t0hWjFduvOzbtv7toDH1/hIrfRNIDBnnBWd0CwJTGvTpngVlmwGCdP9/Zl/tVrDqcuYzQ==";
      };
    }
    {
      name = "schema_utils___schema_utils_3.3.0.tgz";
      path = fetchurl {
        name = "schema_utils___schema_utils_3.3.0.tgz";
        url  = "https://registry.yarnpkg.com/schema-utils/-/schema-utils-3.3.0.tgz";
        sha512 = "pN/yOAvcC+5rQ5nERGuwrjLlYvLTbCibnZ1I7B1LaiAz9BRBlE9GMgE/eqV30P7aJQUf7Ddimy/RsbYO/GrVGg==";
      };
    }
    {
      name = "source_map_js___source_map_js_1.2.1.tgz";
      path = fetchurl {
        name = "source_map_js___source_map_js_1.2.1.tgz";
        url  = "https://registry.yarnpkg.com/source-map-js/-/source-map-js-1.2.1.tgz";
        sha512 = "UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==";
      };
    }
    {
      name = "streamsearch___streamsearch_1.1.0.tgz";
      path = fetchurl {
        name = "streamsearch___streamsearch_1.1.0.tgz";
        url  = "https://registry.yarnpkg.com/streamsearch/-/streamsearch-1.1.0.tgz";
        sha512 = "Mcc5wHehp9aXz1ax6bZUyY5afg9u2rv5cqQI3mRrYkGC8rW2hM02jWuwjtL++LS5qinSyhj2QfLyNsuc+VsExg==";
      };
    }
    {
      name = "styled_jsx___styled_jsx_5.1.1.tgz";
      path = fetchurl {
        name = "styled_jsx___styled_jsx_5.1.1.tgz";
        url  = "https://registry.yarnpkg.com/styled-jsx/-/styled-jsx-5.1.1.tgz";
        sha512 = "pW7uC1l4mBZ8ugbiZrcIsiIvVx1UmTfw7UkC3Um2tmfUq9Bhk8IiyEIPl6F8agHgjzku6j0xQEZbfA5uSgSaCw==";
      };
    }
    {
      name = "tslib___tslib_2.8.1.tgz";
      path = fetchurl {
        name = "tslib___tslib_2.8.1.tgz";
        url  = "https://registry.yarnpkg.com/tslib/-/tslib-2.8.1.tgz";
        sha512 = "oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==";
      };
    }
    {
      name = "universal_cookie___universal_cookie_7.2.2.tgz";
      path = fetchurl {
        name = "universal_cookie___universal_cookie_7.2.2.tgz";
        url  = "https://registry.yarnpkg.com/universal-cookie/-/universal-cookie-7.2.2.tgz";
        sha512 = "fMiOcS3TmzP2x5QV26pIH3mvhexLIT0HmPa3V7Q7knRfT9HG6kTwq02HZGLPw0sAOXrAmotElGRvTLCMbJsvxQ==";
      };
    }
    {
      name = "uri_js___uri_js_4.4.1.tgz";
      path = fetchurl {
        name = "uri_js___uri_js_4.4.1.tgz";
        url  = "https://registry.yarnpkg.com/uri-js/-/uri-js-4.4.1.tgz";
        sha512 = "7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==";
      };
    }
    {
      name = "url_loader___url_loader_4.1.1.tgz";
      path = fetchurl {
        name = "url_loader___url_loader_4.1.1.tgz";
        url  = "https://registry.yarnpkg.com/url-loader/-/url-loader-4.1.1.tgz";
        sha512 = "3BTV812+AVHHOJQO8O5MkWgZ5aosP7GnROJwvzLS9hWDj00lZ6Z0wNak423Lp9PBZN05N+Jk/N5Si8jRAlGyWA==";
      };
    }
    {
      name = "use_sync_external_store___use_sync_external_store_1.4.0.tgz";
      path = fetchurl {
        name = "use_sync_external_store___use_sync_external_store_1.4.0.tgz";
        url  = "https://registry.yarnpkg.com/use-sync-external-store/-/use-sync-external-store-1.4.0.tgz";
        sha512 = "9WXSPC5fMv61vaupRkCKCxsPxBocVnwakBEkMIHHpkTTg6icbJtg6jzgtLDm4bl3cSHAca52rYWih0k4K3PfHw==";
      };
    }
  ];
}
