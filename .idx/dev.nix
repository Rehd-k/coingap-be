# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    # pkgs.go
    # pkgs.python311
    # pkgs.python311Packages.pip
    pkgs.nodejs_20
    # pkgs.nodePackages.nodemon
  ];

  # Sets environment variables in the workspace
  env = {
    binance_api_key = "hJ1EV1kMNT4Hy98MeHXP4pnfzAS14d7p9QiIU5MSOrNYPlFsXK2QoqgLIG5mzfEn";
    binance_secret_key = "M76iGZ0gk5XYf7B9m87aEh4XaAGccIJSmY6fR6lGUma8bShXouB5MhMI0SxYKeJS";
    bybit_key = "M1wZNGze0LtbfOODOf";
    bybit_secret_key = "hCLFL6J3ZWjqynRXKuaS7hCtnRnePTpx6CSY";
    okx_passPhrase = "this@ISmy2407";
    okx_api_key = "ea87d46e-a194-46d2-bdd9-f8e8228e6dc3";
    okx_secret_key = "329D04F412FA0989170B1D9F051FFFA5";
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
    ];

    # Enable previews
    previews = {
      enable = true;
      previews = {
        # web = {
        #   # Example: run "npm run dev" with PORT set to IDX's defined port for previews,
        #   # and show it in IDX's web preview panel
        #   command = ["npm" "run" "dev"];
        #   manager = "web";
        #   env = {
        #     # Environment variables to set for your server
        #     PORT = "$PORT";
        #   };
        # };
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Example: install JS dependencies from NPM
        # npm-install = "npm install";
      };
      # Runs when the workspace is (re)started
      onStart = {
        # Example: start a background task to watch and re-build backend code
        # watch-backend = "npm run watch-backend";
      };
    };
  };
}
