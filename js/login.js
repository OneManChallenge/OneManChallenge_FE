function checkLogin() {
    const input_email = $("#floatingEmail").val();
    const input_pwd1 = $("#floatingPassword").val();

    const pattern =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

      //이메일 형식 검사
    if (pattern.test(input_email) == false) {
      alert("이메일 형식(@)이 아닙니다..");
      return;
    }

    const data = {
      email: input_email,
      password: input_pwd1,
    };

    $.ajax({
      type: "POST",
      url: "http://192.168.4.221:8080/api/v1/member/login",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      success: function (response, status, xhr) {  //이렇게 3개 작성해야함
        //alert(response["msg"]);

        //쿠키에 헤더 토큰 값 저장
        document.cookie =
          "Authorization" +
          "=" +
          xhr.getResponseHeader("Authorization") +
          ";path=/";

        document.cookie =
          "OneManToken" +
          "=" +
          xhr.getResponseHeader("OneManToken") +
          ";path=/";

        window.location.href = "./main.html";
      },
      error: function (response) {
        alert(response.responseJSON.msg);
      },
    });
  }

  function moveSignup() {
    window.location.href = "./signup.html";
  }