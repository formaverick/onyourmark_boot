import React from "react";
import "./detailPayment.css";

function DetailPayment() {
  return (
    <section id="payment" className="detailPayment">
      <div className="paymentTop">
        <div className="paymentTitle">PAYMENT INFO</div>
        <div className="paymentcontents">
          고액결제의 경우 안전을 위해 카드사에서 확인전화를 드릴 수도 있습니다.
          확인과정에서 도난 카드의 사용이나 타인 명의의 주문등 정상적인 주문이
          아니라고 판단될 경우 임의로 주문을 보류 또는 취소할 수 있습니다.  
          <br /><br />
          무통장 입금은 상품 구매 대금은 PC뱅킹, 인터넷뱅킹, 텔레뱅킹 혹은 가까운
          은행에서 직접 입금하시면 됩니다.  
          <br />
          주문시 입력한 입금자명과 실제입금자의 성명이 반드시 일치하여야 하며,
          3일 이내로 입금을 하셔야 하며 입금되지 않은 주문은 자동취소 됩니다.
        </div>
      </div>

      <div className="paymentTop">
        <div className="paymentTitle">DELIVERY INFO</div>
        <div className="paymentcontents">
          <ul>
            <li>배송 방법 : 택배</li>
            <li>배송 지역 : 전국지역</li>
            <li>배송 비용 : 3,500원</li>
            <li>배송 기간 : 1일 ~ 3일</li>
            <li>배송 안내 : 주문해주시기 전에 참고하세요!</li>
            <li>
              총 결제 금액이 50,000원 미만일 경우, 배송비 3,500원이 부과됩니다.
              <br />
              - 단, 제주도 및 도서산간지역은 3,000원 이상의 추가 비용이 발생합니다.
              <br />
              - 당일발송 : 오후 12시까지 주문 및 결제완료분(평균배송일 1~3일 소요)
              <br />
              - 주문일로부터 3일 이내에 결제확인이 안된 주문 건은 자동 취소 됩니다.
              <br />
              - 장바구니에 담은 제품은 최대 3일간 저장됩니다.
            </li>
          </ul>
        </div>
      </div>

      <div className="paymentBottom">
        <div className="paymentTitle">EXCHANGE INFO</div>
        <div className="paymentcontents">
          <strong>반품 주소</strong>
          <br />
          - [07532] 서울 강서구 양천로 551-24 한화비즈메트로2차 203호
          <br /><br />
          <strong>반품이 가능한 경우</strong>
          <br />
          - 계약내용에 관한 서면을 받은 날부터 7일. 단, 그 서면을 받은 때보다
          재화등의 공급이 늦게 이루어진 경우에는 재화등을 공급받거나 재화등의
          공급이 시작된 날부터 7일 이내
          <br />
          - 공급받으신 상품 및 용역의 내용이 표시.광고 내용과 다르거나 계약내용과
          다르게 이행된 때에는 당해 재화 등을 공급받은 날 부터 3월이내, 그사실을
          알게 된 날 또는 알 수 있었던 날부터 30일이내
          <br /><br />
          <strong>반품이 불가능한 경우</strong>
          <br />
          - 이용자에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우<br />
          - 이용자의 사용 또는 일부 소비에 의하여 재화 등의 가치가 현저히 감소한 경우<br />
          - 시간의 경과에 의하여 재판매가 곤란할 정도로 재화등의 가치가 현저히 감소한 경우<br />
          - 복제가 가능한 재화등의 포장을 훼손한 경우<br />
          - 개별 주문 생산되는 재화 등 청약철회시 판매자에게 회복할 수 없는 피해가
          예상되어 소비자의 사전 동의를 얻은 경우<br />
          - 디지털 콘텐츠의 제공이 개시된 경우 (단, 가분적 디지털콘텐츠는 예외)
          <br /><br />
          ※ 고객님의 변심으로 인한 교환·반품 시 배송비는 고객 부담입니다.
        </div>
      </div>

      <div className="paymentBottom">
        <div className="paymentTitle">SERVICE INFO</div>
        <div className="paymentcontents">
          <strong>품질보증기준</strong>
          <br />
          공정거래위원회가 고시한 소비자분쟁해결기준에 의거 정당한 소비자 피해에
          대해 수리, 교환, 환불 해드립니다.
          <br /><br />
          <strong>주문후 예상 배송 기간</strong>
          <br />
          출고일부터 1~3일 이내  
          <br />
          한진택배 (1588-0011)
          <br /><br />
          <strong>A/S 안내</strong>
          <br />
          온유어마크 고객센터 문의  
          <br />
          온유어마크에서 취급하는 모든 제품은 국내 정품이며, 품질보증기간 내
          A/S 접수를 지원합니다.
        </div>
      </div>
    </section>
  );
}

export default DetailPayment;