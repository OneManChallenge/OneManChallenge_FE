  //뉴스 검색 초기화 전역변수
  let page_count = 0;
  let news_count = 1;
  let old_search = "";

  //무한 스크롤
  $(window).scroll(function () {
    if (
      $(window).scrollTop() + $(window).outerHeight() >
      $(document).height() - 1
    ) {
      searchNews();
      return;
    }
  });

  //뉴스 검색 함수
  function searchNews() {
    page_count++;
    //alert(page_count);
    const input_category = $(".form-select").val();
    const input_search = $("#search-input").val();
    const input_page = page_count;

    if (input_category == "카테고리") {
      alert("카테고리를 선택해주세요.");
      return;
    }

    if (input_search == "") {
      alert("검색어를 입력해주세요.");
      return;
    }

    //새로운 검색어 일 경우 초기화
    if (old_search != input_search) {
      page_count = 0;
      news_count = 1;
      old_search = input_search;
      $(".news-box *").remove(); //
    }

    const authAccess = getAccessToken();
    const authRefresh = getRefreshToken();

    $.ajax({
      type: "GET",
      url: "http://192.168.4.221:8080/api/v1/news/list",
      data: {
        category: input_category,
        search: input_search,
        page: input_page,
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", authAccess);
        xhr.setRequestHeader("OneManToken", authRefresh);
      },
      success: function (response, status, xhr) {  //이렇게 3개 작성해야함
 
        //Access토큰 재발급한 경우
        if (xhr.getResponseHeader("Authorization") != null) {
          document.cookie =
            "Authorization" +
            "=" +
            xhr.getResponseHeader("Authorization") +
            ";path=/";
        }

        let rows = response["data"];
        for (let i = 0; i < rows.length; i++) {
          let news_no = news_count++;
          let news_division = rows[i]["division"];
          let news_title = rows[i]["title"];
          let news_content = rows[i]["content"];
          let news_article_date = rows[i]["articleDate"];
          let news_img_url = rows[i]["imgUrl"];
          let news_main_url = rows[i]["mainUrl"];
          let news_views = rows[i]["views"];

          if (news_img_url == "") {
            news_img_url = "./img/logo-oneman.JPG";
          }

          let temp_html = `
            <div class="news-box-list">
    <div class="news-no">
      <span>${news_no}</span>
    </div>
    <div class="news-views">
      <span>조회수</span>
      <span>${news_views}</span>
    </div>
            <div class="news-list">
      <img class="news-img" src="${news_img_url}" alt="뉴스 섬네일" />
      <div class="news-info">
        <div class="news-info-header">
          <span class="news-division">${news_division}</span>
          <span class="article-date">${news_article_date}</span>
        </div>
        <div class="news-info-body">
          <a class="news-link" href="${news_main_url}" target="_blank">
            <span class="news-title"
              >${news_title}
            </span>
            <span class="news-content"
              >${news_content}
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>`;

          $(".news-box").append(temp_html);
        }
      },
      error: function (response) {
        alert(response.responseJSON.msg);
      },
    });
  }

  function getAccessToken() {
    let cName = "Authorization" + "=";
    let cookieData = document.cookie;
    let cookie = cookieData.indexOf("Authorization");
    let auth = "";
    if (cookie !== -1) {
      cookie += cName.length;
      let end = cookieData.indexOf(";", cookie);
      if (end === -1) end = cookieData.length;
      auth = cookieData.substring(cookie, end);
    }

    // kakao 로그인 사용한 경우 Oneman 추가
    if (auth.indexOf("Oneman") === -1 && auth !== "") {
      auth = "Oneman " + auth;
    }

    return auth;
  }

  function getRefreshToken() {
    let cName = "OneManToken" + "=";
    let cookieData = document.cookie;
    let cookie = cookieData.indexOf("OneManToken");
    let auth = "";
    if (cookie !== -1) {
      cookie += cName.length;
      let end = cookieData.indexOf(";", cookie);
      if (end === -1) end = cookieData.length;
      auth = cookieData.substring(cookie, end);
    }

    // kakao 로그인 사용한 경우 Oneman 추가
    if (auth.indexOf("Oneman") === -1 && auth !== "") {
      auth = "Oneman " + auth;
    }

    return auth;
  }

  function logout() {
    const authAccess = getAccessToken();
    const authRefresh = getRefreshToken();

    $.ajax({
      type: "POST",
      url: "http://192.168.4.221:8080/api/v1/member/logout",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", authAccess);
        xhr.setRequestHeader("OneManToken", authRefresh);
      },
      success: function (response, status, xhr) {
        //alert(response["msg"]);

        //쿠기 삭제
        document.cookie =
          "Authorization" +
          "=" +
          ";expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        document.cookie =
          "OneManToken" +
          "=" +
          ";expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";

          window.location.href="./login.html"
      },
      error: function (response) {
        alert("로그아웃 실패하였습니다.");
      },
    });
  }

  function main_reload() {
    window.location.reload();
  }

