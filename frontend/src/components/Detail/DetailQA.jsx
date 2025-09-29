import React from "react";
import "./detailQA.css";

function DetailQA() {
  return (
    <section id="qa" className="detailQA">
      <div className="qaTop">
        <h1>Q&A</h1>
        <div>
          <a href="#">LIST</a>
          <a href="#">WRITE</a>
        </div>
      </div>

      <div className="qaBody">
        <table>
          <colgroup>
            <col style={{ width: "70px" }} />
            <col style={{ width: "124px" }} />
            <col style={{ width: "900px" }} />
            <col style={{ width: "80px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "55px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>카테고리</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2</td>
              <td></td>
              <td>혹시 285사이즈는 재입고 계획 없을까요?</td>
              <td>쭈****</td>
              <td>2025-04-29</td>
              <td>12</td>
            </tr>
            <tr>
              <td>1</td>
              <td></td>
              <td>
                <img
                  src="/img/main_page/icon/ico_re.gif"
                  className="reIcon"
                  alt="답변"
                />
                혹시 285사이즈는 재입고 계획 없을까요?
              </td>
              <td>
                <img
                  src="/img/main_page/icon/ico_qa.gif"
                  alt="qa"
                />
              </td>
              <td>2025-04-30</td>
              <td>17</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default DetailQA;
