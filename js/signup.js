function checkSignup() {
    const input_email = $("#floatingEmail").val();
    const input_pwd1 = $("#floatingPassword").val();
    const input_pwd2 = $("#floatingRePassword").val();

    //입력 값 검사
    const pattern =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if (pattern.test(input_email) == false) {
      alert("이메일 형식(@)이 아닙니다..");
      return;
    }

    if (input_pwd1 != input_pwd2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const data = {
      email: input_email,
      password: input_pwd1,
    };

    $.ajax({
      type: "POST",
      url: "http://192.168.4.221:8080/api/v1/member/signup",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      success: function (response) {
        alert(response["msg"]);
        console.log(response);
        console.dir(response);
        window.location.href = "./login.html";
      },

      error: function (response) {
        alert(response.responseJSON.msg);
      },
    });
  }
  function moveLogin() {
    window.location.href = "./login.html";
  }