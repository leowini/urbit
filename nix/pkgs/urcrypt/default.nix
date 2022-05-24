{ stdenv, autoreconfHook, pkgconfig
, libaes_siv, openssl, openssl-static-osx, secp256k1
, enableStatic ? stdenv.hostPlatform.isStatic }:

stdenv.mkDerivation rec {
  name = "urcrypt";
  src  = ../../../pkg/urcrypt;

  # XX why are these required for darwin?
  dontDisableStatic = enableStatic;

  configureFlags = if enableStatic
    then [ "--disable-shared" "--enable-static" ]
    else [];

  nativeBuildInputs =
    [ autoreconfHook pkgconfig ];

  propagatedBuildInputs = [
    (if stdenv.isDarwin && enableStatic then openssl-static-osx else openssl)
    secp256k1
    libaes_siv
  ];
}
