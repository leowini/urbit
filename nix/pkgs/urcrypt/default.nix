{ stdenv, autoreconfHook, pkgconfig
, libaes_siv, openssl, openssl-static-osx, secp256k1
, enableStatic ? stdenv.hostPlatform.isStatic }:

let my-openssl = if enableStatic && stdenv.isDarwin then openssl-static-osx else openssl;
in stdenv.mkDerivation rec {
  name = "urcrypt";
  src  = ../../../pkg/urcrypt;

  # XX why are these required for darwin?
  dontDisableStatic = enableStatic;

  configureFlags = if enableStatic
    then [ "--disable-shared" "--enable-static" ]
    else [];

  nativeBuildInputs =
    [ autoreconfHook pkgconfig ];

  propagatedBuildInputs =
    [ openssl secp256k1 libaes_siv ];
}
