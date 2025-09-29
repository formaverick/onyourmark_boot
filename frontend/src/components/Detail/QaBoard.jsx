import React, { useState } from "react";
import "./QaBoard.css";
import Bottom from "../Bottom/Bottom";

function QaBoard() {
    const [qaList, setQaList] = useState([
        {
            no: 1,
            title: "혹시 285사이즈는 재입고 계획 없을까요?",
            writer: "쭈****",
            date: "2025-04-29",
            view: 12,
            description: "285 사이즈만 품절인데 언제 재입고 되나요?"
        },
        {
            no: 2,
            title: "[답변] 285사이즈 관련 안내드립니다.",
            writer: "운영자",
            date: "2025-04-30",
            view: 17,
            description: "현재 입고 일정은 미정이며, 입고 시 알림 서비스를 이용해주세요."
        },
        {
            no: 3,
            title: "오프라인 재고 문의",
            writer: "사***",
            date: "2025-05-02",
            view: 2,
            description: "오프라인에 250사이즈 재고가 남아 있나요?"
        }
    ]);
    const [selectedQA, setSelectedQA] = useState(null);
    const [writeMode, setWriteMode] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [writer, setWriter] = useState("");

    const maskName = (name) => {
        if (name.length <= 1) return name;
        return name[0] + "*".repeat(name.length - 1);
    };


    const handleRead = (qa) => {
        setSelectedQA({ ...qa, view: qa.view + 1 });
        setQaList(qaList.map(item =>
            item.no === qa.no ? { ...item, view: item.view + 1 } : item
        ));
        setWriteMode(false);
    };

    const handleWrite = () => {
        setSelectedQA(null);
        setTitle("");
        setDescription("");
        setWriteMode(true);
    };

    const handleDelete = (no) => {
        const updatedList = qaList.filter(q => q.no !== no);
        setQaList(updatedList);
        setSelectedQA(null);
    };

    const handleSubmit = () => {
        const newQA = {
            no: qaList.length + 1,
            title,
            writer: maskName(writer || "익명"), // 이름 마스킹 적용
            date: new Date().toISOString().split("T")[0],
            view: 0,
            description
        };
        setQaList([...qaList, newQA]);
        setWriteMode(false);
        setTitle("");
        setDescription("");
        setWriter(""); // 입력 필드 초기화
    };

    return (
        <section className="qaBoard">
            <div className="qaBoardTop">
                <h1>Q&A</h1>
                <div>
                    <a href="#" onClick={() => { setSelectedQA(null); setWriteMode(false); }} className="qaBtn">LIST</a>
                    <a href="#" onClick={handleWrite} className="qaBtn">WRITE</a>
                </div>
            </div>

            {/* 목록 보기 */}
            {!selectedQA && !writeMode && (
                <div className="qaBoardBody">
                    <table>
                        <colgroup>
                            <col style={{ width: "5%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "48%" }} />
                            <col style={{ width: "7%" }} />
                            <col style={{ width: "9%" }} />
                            <col style={{ width: "5%" }} />
                            <col style={{ width: "10%" }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>카테고리</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>작성일</th>
                                <th>조회</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {qaList.slice().reverse().map((qa) => (
                                <tr key={qa.no} onClick={() => handleRead(qa)} style={{ cursor: "pointer" }}>
                                    <td>{qa.no}</td>
                                    <td></td>
                                    <td>{qa.title}</td>
                                    <td>{qa.writer}</td>
                                    <td>{qa.date}</td>
                                    <td>{qa.view}</td>
                                    <td>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(qa.no);
                                            }}
                                            className="qaBtn"
                                            style={{ padding: "4px 10px", fontSize: "12px", backgroundColor:"#1a1a1a", color:"#fff", border:"1px solid #1a1a1a" }}
                                        >
                                            삭제하기
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 질문 보기 */}
            {selectedQA && !writeMode && (
                <div style={{ padding: "20px", borderTop: "1px solid #ddd", marginBottom: "40px" }}>
                    <h4 style={{ marginBottom: "20px" }}>{selectedQA.title}</h4>
                    <p className="qacontent">{selectedQA.description}</p>
                    <button onClick={() => setSelectedQA(null)} className="qaBtn">목록으로</button>
                </div>
            )}

            {/* 질문 작성 */}
            {writeMode && (
                <div style={{ padding: "20px", borderTop: "1px solid #ddd" }}>
                    <input
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #d6d6d6" }}
                    />
                    <input
                        type="text"
                        placeholder="작성자 이름"
                        value={writer}
                        onChange={(e) => setWriter(e.target.value)}
                        style={{ width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #d6d6d6" }}
                    />
                    <textarea
                        rows={4}
                        placeholder="내용을 입력하세요"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ width: "100%", padding: "8px", border: "1px solid #d6d6d6", marginBottom: "30px" }}
                    />
                    <br />
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={handleSubmit} className="qaBtn">저장</button>
                        <button onClick={() => setWriteMode(false)} className="qaBtn">취소</button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default QaBoard;