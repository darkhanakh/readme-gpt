const CLIENT_ID = "a45fbdbf5522210a5c2b";

const Login = () => {
  function loginWithGithub() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
    );
  }

  return (
    <>
      <div className="grid h-96 place-items-center">
        <button onClick={loginWithGithub} className="btn btn-outline">
          Login with Github
        </button>
      </div>
    </>
  );
};

export default Login;
