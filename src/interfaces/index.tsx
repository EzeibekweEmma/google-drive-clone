interface Button {
  btnClass: string;
  btnText: string;
  onClick?: () => void;
}

interface GithubAuth {
  clientId: string;
  clientSecret: string;
}
