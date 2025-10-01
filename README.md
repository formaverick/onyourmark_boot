# On Your Mark

<br>

`ONYOURMARK`는 **러닝 전문 이커머스 플랫폼 [온유어마크(onyourmark-running.com)](https://onyourmark-running.com)을 클론**하여,
단순 이커머스 기능을 넘어 **커뮤니티 중심의 풀스택 플랫폼**으로 확장 및 재구현한 프로젝트입니다.  
사용자 중심의 동적인 웹 서비스를 제공하며, 안정적이고 확장 가능한 아키텍처 설계를 목표로 개발되었습니다.

<p align="center"><img width="621" height="748" alt="main" src="https://github.com/user-attachments/assets/f15068b4-3033-4b5e-b18e-a05dd0ff15f6" /></p>


<br>

## 📑 목차 (Table of Contents)

- [🎯 개발 포인트](#-개발-포인트)
- [🛠️ 기술 스택](#️-기술-스택)
- [🏛️ 시스템 아키텍처](#system-architecture)
- [🌊 시퀀스 다이어그램](#-시퀀스-다이어그램-sequence-diagrams)
- [🔗 ERD](#-erd)
- [✨ 주요 기능](#-주요-기능)
- [📝 API 명세](#-api-명세)
- [🤯 트러블 슈팅](#-트러블-슈팅)
- [🖼️ 결과 화면](#screenshots)
- [📝 회고](#-회고)

<br>

## 🎯 개발 포인트

- **이커머스 핵심 기능과 커뮤니티 로직의 통합 설계**  
  원본 사이트의 이커머스 기능을 기반으로, 사용자가 직접 콘텐츠를 생성하고 상호작용할 수 있는 커뮤니티 로직을 통합 설계했습니다.

- **실제 서비스 수준의 아키텍처 설계 및 성능 최적화**  
  React와 Spring Boot를 사용하여 풀스택 아키텍처를 직접 설계·구축하고, 보안·성능·유지보수성을 고려한 구조를 적용했습니다.

- **AI 기술 융합**  
  원본 사이트에는 없는 차별화된 사용자 경험을 제공하기 위해, 리뷰 기능에 Python 마이크로서비스 기반 AI 감성 분석 모델을 연동했습니다.

- **안정적인 파일 업로드/이미지 관리**  
  범용 `FileService`를 구현해 파일 입출력 로직을 모듈화하고,  
  UUID 기반 파일명 생성 + 날짜별 폴더 구조로 충돌을 방지하며 관리 효율성을 높였습니다.

<br>

## 🛠️ 기술 스택

<div>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"/>
  <img src="https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white"/>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white"/>
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=Flask&logoColor=white"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white"/>
  <img src="https://img.shields.io/badge/JPA(Hibernate)-59666C?style=for-the-badge&logo=Hibernate&logoColor=white"/>
  <img src="https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=Gradle&logoColor=white"/>
</div>

<br>

<div align="center">

| 구분         | 기술                                                          |
| ------------ | ------------------------------------------------------------- |
| **Frontend** | React, Axios, React-Router, Redux Toolkit                     |
| **Backend**  | Java 17, Spring Boot, Spring Security, JPA(Hibernate), Gradle |
| **Database** | MySQL                                                         |
| **AI (ML)**  | Python, Flask, Hugging Face Transformers                      |
| **DevOps**   | Git                                                           |

</div>

<br>

<a id="system-architecture"></a>
## 🏛️ 시스템 아키텍처 (System Architecture)

```mermaid
graph TD
    subgraph "사용자 영역"
        User("Client (Web Browser)")
    end

    subgraph "애플리케이션 인프라"
        Frontend("Frontend (React)")
        Backend("Backend (Spring Boot)")
        AIService("AI Microservice (Python/Flask)")
    end

    subgraph "데이터 & 스토리지"
        DB[("Database (MySQL)")]
        Storage[("File Storage")]
    end

    %% Connections
    User -- "HTTPS" --> Frontend
    Frontend -- "REST API 요청" --> Backend

    Backend -- "JPA/JDBC" --> DB
    Backend -- "파일 저장/조회" --> Storage
    Backend -- "감성 분석 API 요청" --> AIService
```

<br>

## 🌊 시퀀스 다이어그램 (Sequence Diagrams)

### 1. 리뷰 게시판 + 감성 분석

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Frontend as 프론트엔드 (React)
    participant Backend as 백엔드 (Spring)
    participant HuggingFace as 감성분석 (Python)
    participant DB as 데이터베이스

    User->>Frontend: 리뷰 작성 및 제출
    Frontend->>Backend: POST /api/review (리뷰 내용, 이미지, JWT)
    Backend->>Backend: JwtAuthFilter: 토큰 유효성 검사
    Backend->>Backend: ReviewController -> ReviewService.create()
    Backend->>HuggingFace: POST /api/analyze (리뷰 내용)
    HuggingFace-->>Backend: 감성 분석 결과 (sentiment 점수)
    Backend->>DB: INSERT INTO review (내용, sentiment, user_id)
    DB-->>Backend: 저장된 리뷰 ID 반환
    Backend->>Backend: 이미지 파일 시스템에 저장
    Backend->>DB: INSERT INTO review_img (review_id, img_url)
    DB-->>Backend: 저장 완료
    Backend-->>Frontend: 생성된 리뷰 정보 (JSON)
    Frontend->>User: "리뷰 등록 완료" 알림 및 상세 페이지로 이동
```

### 2. JWT 인증 (관리자 공지사항 삭제 예시)

```mermaid
sequenceDiagram
    participant User as 사용자/관리자
    participant Frontend as 프론트엔드 (React)
    participant Backend as 백엔드 (Spring)
    participant DB as 데이터베이스

    %% --- 1. 로그인 및 토큰 발급 ---
    User->>Frontend: 관리자 아이디/비밀번호 입력 후 로그인
    Frontend->>Backend: POST /api/auth/login (userid, password)
    Backend->>DB: SELECT * FROM user WHERE userid=?
    DB-->>Backend: 관리자 정보 반환 (role='ADMIN')
    Backend->>Backend: 비밀번호 검증 (PasswordEncoder)
    alt 비밀번호 일치
        Backend->>Backend: JWT 생성 (role: ADMIN 포함)
        Backend-->>Frontend: JWT 토큰 반환
        Frontend->>Frontend: localStorage에 JWT 저장
        Frontend->>User: 로그인 성공 → 관리자 페이지 이동
    else 비밀번호 불일치
        Backend-->>Frontend: 401 Unauthorized
    end

    %% --- 2. 관리자 권한으로 공지사항 삭제 ---
    User->>Frontend: 공지사항 '삭제' 버튼 클릭
    Frontend->>Frontend: localStorage에서 JWT 꺼내기
    Frontend->>Backend: DELETE /api/notices/{id} (Authorization: Bearer JWT)

    Backend->>Backend: JwtAuthFilter → 토큰 검증
    Backend->>Backend: JWT Payload 추출 (sub, role=ADMIN)
    Backend->>Backend: SecurityContext에 ROLE_ADMIN 저장
    Backend->>Backend: @PreAuthorize("hasRole('ADMIN')") 검사

    alt 권한 확인 성공
        Backend->>Backend: Service 공지사항 삭제 호출
        Backend->>DB: DELETE FROM notice WHERE id=? (트랜잭션)
        DB-->>Backend: 삭제 성공
        Backend-->>Frontend: 204 No Content
        Frontend->>User: UI에서 공지사항 제거 및 완료 메시지
    else 권한 없음
        Backend-->>Frontend: 403 Forbidden
    end
```

<br>

## 🔗 ERD

📊 전체 테이블 구조는 [Google Sheets] https://docs.google.com/spreadsheets/d/1bTXc3KSDw5LSB-16UCVfFV8iHM6LN_cmsZGpj8ih0rE/edit?usp=sharing 에서 확인할 수 있습니다.

<p align="center"><img width="600" alt="ERD diagram" src="https://github.com/user-attachments/assets/b4e1ec53-3b9a-43b2-819f-d74a4e2ed599" /></p>


<br>

## ✨ 주요 기능

### 1. JWT 기반 인증 및 인가

- Spring Security를 커스터마이징하여 Stateless한 JWT(Access/Refresh Token) 기반 인증/인가 시스템을 구축했습니다.
- `OncePerRequestFilter`를 상속받은 `JwtAuthFilter`를 구현하여, 인증/인가 로직을 비즈니스 로직과 분리하고 코드의 재사용성과 유지보수성을 향상시켰습니다.

```java
// JwtAuthFilter.java
@Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = jwtUtil.resolveToken(request);

        if(token != null && jwtUtil.validateToken(token)){
            String userid = jwtUtil.getUseridFromToken(token);
            String role = jwtUtil.getRoleFromToken(token);

            List<GrantedAuthority> authorities
                    = (role != null && !role.isBlank())
                    ? List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    : List.of();

            System.out.println("Authorities set: " + authorities);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userid, null, authorities);

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
```

<br>

### 2. AI 감성 분석 기반 리뷰 (Hugging Face 연동)

- 사용자가 리뷰를 작성하면, 백엔드에서 Python(Flask)으로 구현된 AI 서버에 API 요청을 보내 리뷰 텍스트의 감성을 분석합니다.
- AI/ML 로직을 별도의 마이크로서비스로 분리하여, 각 서비스가 독립적으로 개발/배포/확장될 수 있는 유연한 구조를 설계했습니다.

```java
// ReviewService.java
private int analyzeSentiment(String content) {
    try {
        Map<String, String> request = Map.of("content", content);
        // Bean으로 등록된 RestTemplate과 @Value로 주입받은 URL 사용
        Map<String, Object> response = restTemplate.postForObject(flaskApiUrl, request, Map.class);

        if (response == null || !Objects.equals(response.get("status"), "success")) {
            throw new RuntimeException("Flask 감성분석에 실패했습니다.");
        }
        return (int) response.get("sentiment");
    } catch (Exception e) {
        throw new RuntimeException("감성 분석 서비스 호출에 실패했습니다.", e);
    }
}
```

<br>

### 3. 복합 비즈니스 로직을 처리하는 게시판

- 회원/비회원 모두 작성 가능하며, 비밀글 기능까지 포함된 게시판을 구현했습니다.
- Builder 패턴과 `@Transactional`을 적용하여 객체 생성의 안정성과 데이터의 정합성을 확보했습니다.

```java
// BoardService.java
@Transactional
public Long create(BoardPostCreateRequest request, String userid) {
    BoardPost.BoardPostBuilder b = BoardPost.builder()
            .title(request.getTitle())
            .content(request.getContent())
            .postPassword(passwordEncoder.encode(request.getPostPassword()))
            .isSecret(request.isSecret());

    if (userid != null) { // 회원
        User u = userRepository.findByUserid(userid).orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));
        b.writerType(WriterType.MEMBER).member(u);
    } else { // 비회원
        if (request.getWriterName() == null || request.getWriterName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "작성자명을 입력해주세요.");
        }
        b.writerType(WriterType.GUEST).writerName(request.getWriterName());
    }
    return boardRepository.save(b.build()).getId();
}
```

<br>

### 4. 안정적인 파일 업로드

- 파일 입출력 로직을 `FileService`라는 범용 서비스로 분리하여 역할과 책임을 명확히 하고(SRP), 코드의 재사용성을 높였습니다.
- `UUID`를 이용해 파일명을 생성하여 이름 충돌을 방지하고, 날짜 기반으로 폴더를 생성하여 파일을 체계적으로 관리합니다.

```java
// ReviewImgService.java - 도메인 특화 서비스
public ReviewImg save(Review review, MultipartFile file) throws Exception {
    String oriImgName = file.getOriginalFilename();
    String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
    String savePath = reviewImgLocation + "/" + today;

    // 범용 FileService에 파일 저장을 위임
    String saved = fileService.uploadFile(savePath, oriImgName, file.getBytes());

    ReviewImg img = ReviewImg.builder() ... .build();
    return reviewImgRepository.save(img);
}

// FileService.java - 범용 파일 저장 서비스
public String uploadFile(String uploadPath, String originalFileName, byte[] fileData) throws Exception {
    Path dir = Paths.get(uploadPath).toAbsolutePath().normalize();
    Files.createDirectories(dir);
    String saved = UUID.randomUUID() + "." + getExtension(originalFileName);
    Path target = dir.resolve(saved).normalize();
    Files.copy(new java.io.ByteArrayInputStream(fileData), target, StandardCopyOption.REPLACE_EXISTING);
    return saved;
}
```

<br>

## 📝 API 명세

👉 전체 API 문서는 [Postman Docs](https://documenter.getpostman.com/view/48241033/2sB3QFPrEj) 에서 확인할 수 있습니다.

<div align="center">

| 구분       | 메서드 | 엔드포인트          | 설명                      |
| ---------- | ------ | ------------------- | ------------------------- |
| Auth       | POST   | /api/auth/login     | 로그인 (JWT 발급)         |
| Auth       | POST   | /api/auth/signup    | 회원가입                  |
| Members    | GET    | /api/members/member | 내 정보 조회              |
| Board(Q&A) | POST   | /api/board/new      | 게시글 작성               |
| Board(Q&A) | DELETE | /api/board/{id}     | 게시글 삭제               |
| Reposts    | POST   | /api/reposts/{id}   | 답변 작성 (관리자 전용)   |
| Notices    | GET    | /api/notices        | 공지사항 목록             |
| Notices    | DELETE | /api/notices/{id}   | 공지사항 삭제 (관리자)    |
| Review     | POST   | /api/review         | 리뷰 작성 (이미지 업로드) |

</div>

<br>

## 🤯 트러블 슈팅

### 1. 게시글 목록 조회 시 N+1 문제 발생

#### 👉 JPA Fetch 전략 최적화로 쿼리 성능 개선

* **문제 상황**

  * 게시글(BoardPost) 목록 조회 시, 작성자(User) 정보를 지연 로딩(LAZY)으로 가져오면서 불필요한 N개의 추가 쿼리가 발생하는 N+1 문제를 발견.
  * 게시글 100개 조회 시 총 101번의 쿼리가 실행되어 성능 저하 발생.

* **해결 과정**

  * JPQL `JOIN FETCH`를 적용하여 `BoardPost`와 연관된 `User` 엔티티를 한 번의 쿼리로 조회하도록 리팩토링.
  * 지연 로딩으로 인한 N+1 문제를 근본적으로 제거.

* **결과**

  * 101번 실행되던 쿼리를 1번으로 최적화, DB 부하를 크게 감소.
  * API 평균 응답 속도가 **약 52% 개선 (250ms → 120ms)**.
  * ORM Fetch 전략 및 성능 병목 구간 최적화 역량 확보.

```java
// BoardRepository.java
@Query("SELECT b FROM BoardPost b JOIN FETCH b.member ORDER BY b.createdAt DESC")
List<BoardPost> findAllWithUser();
```

---

### 2. 유사 리뷰 추천 기능의 비효율적인 아키텍처

#### 👉 Native Query 기반으로 데이터 계층에서 직접 처리

* **문제 상황**

  * 리뷰 추천 로직이 AI 서버(Flask)에 과도하게 의존.
  * 불필요한 API 호출 + 대량 데이터 전송으로 네트워크 지연 및 메모리 부하 발생.

* **해결 과정**

  * 추천 로직(유사도 계산 + 정렬 + 개수 제한)을 DB Native Query로 재구현.
  * 모든 연산을 DB에서 처리하고, 애플리케이션은 최종 결과만 수신하도록 아키텍처 개선.

* **결과**

  * 불필요한 외부 API 호출 제거 → AI 서버 장애/지연의 영향 최소화.
  * 복잡한 연산을 DB로 위임하여 서버 자원(CPU·메모리) 최적화.
  * 책임과 역할을 계층별로 분리, 안정성과 성능 모두 개선.
  * 시스템의 비효율을 아키텍처 관점에서 진단하고, 책임과 역할의 재분배를 통해 성능을 개선하는 역량 확보

```java
// ReviewRepository.java
@Query(value = "SELECT * FROM review r " +
               "WHERE r.review_id != :reviewId AND ABS(r.sentiment - :sentiment) <= 1 " +
               "ORDER BY ABS(r.sentiment - :sentiment) ASC, r.created_at DESC " +
               "LIMIT 5", nativeQuery = true)
List<Review> findSimilarReviews(@Param("sentiment") int sentiment,
                                @Param("reviewId") Long reviewId);
```

---

### 3. Spring Security 인증/인가 문제

#### 👉 FilterChain 재구성과 권한(Role) 매핑 수정

* **문제 상황**

  * JWT 토큰이 정상 발급되었음에도 일부 API 요청에서 `403 Forbidden` 발생.
  * 사용자 권한(Role)에 따른 접근 제어가 기대와 다르게 동작.

* **해결 과정**

  * `JwtAuthFilter`를 `UsernamePasswordAuthenticationFilter` 앞에 등록하여 토큰 검증 순서 보장.
  * `requestMatchers()`로 엔드포인트별 권한을 명확히 재정의.

* **결과**

  * 인증/인가 로직이 정상적으로 동작하며, 역할(Role) 기반 접근 제어 확립.
  * Spring Security FilterChain의 실행 순서와 커스터마이징 방법에 대한 깊은 이해 확보.

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .cors(cors -> {})
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            // 공용 API
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers("/api/auth/**", "/api/board/**", "/api/reposts/**", "/api/review/**", "/img/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/notices/**").permitAll()

            // 인증 필요 API
            .requestMatchers("/api/notices/**", "/api/members/**").authenticated()

            // 관리자 전용 API
            .requestMatchers("/api/admin/**").hasRole("ADMIN")

            // 그 외 요청
            .anyRequest().authenticated())
        .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
```

<br>

<a id="screenshots"></a>
## 🖼️ 결과 화면

### 회원가입 & 로그인

https://github.com/user-attachments/assets/005a20c5-653e-499a-b300-615a61b077fd

<div align="center">

| 기능 | 설명 | 화면 |
|------|------|------|
| 회원가입 | 사용자 정보 입력 후 가입 완료 | <img width="250" src="https://github.com/user-attachments/assets/e845bf2a-cc45-4d2e-8256-a882ff6eed7e" /> |
| 로그인 | 아이디/비밀번호 입력 후 로그인 성공 알림 | <img width="250" src="https://github.com/user-attachments/assets/559e0871-cf4a-4338-b37f-8c60fbb5d539" /> |
| 회원정보 수정 | 비밀번호 확인 후 수정 가능 | <img width="250" src="https://github.com/user-attachments/assets/5a29246e-2feb-4d95-b471-ffb0c97c6425" /> |

</div>

<br>

<details> 
<summary>📂 전체 화면 더보기</summary>

<img width="45%" alt="회원가입완료페이지" src="https://github.com/user-attachments/assets/1b426227-7996-40bf-a6b9-9b5d1453e711" />
<img width="45%" alt="로그인 완료 알림" src="https://github.com/user-attachments/assets/0a94fc19-34cc-4db0-9f33-6d985b4dae58" />
<img width="45%" alt="회원정보수정 - 페이지" src="https://github.com/user-attachments/assets/6ed8d9a7-1cf7-4b81-a033-0ddcc4d72c98" />

</details>

<br>

### 리뷰 작성 + AI 감성 분석 결과

https://github.com/user-attachments/assets/7cff6deb-b71f-4440-ab76-a543d5d1e846

<div align="center">

| 기능 | 설명 | 화면 |
|------|------|------|
| 리뷰 작성 | 로그인 필요 알림 후 작성 가능 | <img width="250" src="https://github.com/user-attachments/assets/79bd857e-56e3-4971-946f-8ac12ddfb11f" /> |
| 리뷰 상세 | 감성 분석 결과와 함께 리뷰 상세 표시 | <img width="250" src="https://github.com/user-attachments/assets/97737fdc-c9df-4fe7-a12d-3fa9bb49c3b9" /> |
| 리뷰 삭제 | 작성자 로그인 시 삭제 가능 | <img width="250" src="https://github.com/user-attachments/assets/03369202-cfb4-4a9c-8998-bd4b24b01358" /> |

</div>

<br>

<details> 

<summary>📂 전체 화면 더보기</summary>
<img width="45%" alt="리뷰 - 리스트페이지" src="https://github.com/user-attachments/assets/b8d36d8c-a595-4c2d-b002-0aa259361e4a" />
<img width="45%" alt="리뷰 - 작성페이지" src="https://github.com/user-attachments/assets/79bd857e-56e3-4971-946f-8ac12ddfb11f" />
<img width="45%" alt="리뷰 - 작성(로그인필요알림)" src="https://github.com/user-attachments/assets/562bea68-eb57-43af-bf40-9692d75e172d" />
<img width="45%" alt="리뷰 - 등록 완료 상세 페이지 ( 로그인 시 삭제 버튼 노출 )" src="https://github.com/user-attachments/assets/c481cfc1-8d0d-435d-802e-f45841dea07a" />
<img width="45%" alt="리뷰 - 삭제 확인 알림창" src="https://github.com/user-attachments/assets/daf02093-1cfe-450a-abff-9f231a9a1982" />

</details>

<br>

### Q&A 게시판 & 관리자 답변

https://github.com/user-attachments/assets/ca8a06f3-3e3c-4c18-b290-5cb2f1c1267c

https://github.com/user-attachments/assets/00a4aa2b-4adb-484c-bc8a-195c9c102d4d

<div align="center">

| 기능 | 설명 | 화면 |
|------|------|------|
| 문의 작성 | 회원/비회원 모두 작성 가능 (비공개글 지원) | <img width="250" src="https://github.com/user-attachments/assets/b46cede5-5fe0-43cf-b2ec-90385a9c77da" /> |
| 문의 상세 | 회원은 본인 글만, 비공개글 비밀번호 입력 필요, 관리자는 전체 열람 가능 | <img width="250" src="https://github.com/user-attachments/assets/6b8a928b-fc4e-49c7-97ac-9dbdaf169ce2" /> |
| 관리자 답변 | 관리자 계정으로 답변 등록/수정 | <img width="250" src="https://github.com/user-attachments/assets/fff50eeb-c41f-4cc2-bda0-cda91ed8f284" /> |

</div>

<br>

<details> 

<summary>📂 전체 화면 더보기</summary>
<img width="45%" alt="Q A - 리스트" src="https://github.com/user-attachments/assets/8d930b1d-d466-4ce3-9b3c-1b08c69dabb6" />
<img width="45%" alt="Q A - 문의 작성(회원)" src="https://github.com/user-attachments/assets/054193a8-6b4c-4cae-90a4-dfa2abd8e582" />
<img width="45%" alt="Q A - (회원)내문의내역 확인" src="https://github.com/user-attachments/assets/bd916321-aa72-4c86-a7e6-587b23888bae" />
<img width="45%" alt="Q A - 비공개 글 비밀번호 확인" src="https://github.com/user-attachments/assets/b577b90f-a807-4619-80e3-59dcb824d082" />
<img width="45%" alt="Q A - 문의 상세 조회" src="https://github.com/user-attachments/assets/6b8a928b-fc4e-49c7-97ac-9dbdaf169ce2" />
<img width="45%" alt="Q A - 문의 상세 조회 (비밀번호 불일치)" src="https://github.com/user-attachments/assets/2bc04911-050e-4b3d-ac2c-5ec47f45c8b6" />
<img width="45%" alt="Q A - 수정 비밀번호 확인" src="https://github.com/user-attachments/assets/3c887c84-48c9-4c36-9710-f042e4c56ae7" />
<img width="45%" alt="Q A - 수정 페이지" src="https://github.com/user-attachments/assets/e3e74a60-8aba-49e3-bde6-4f7901870928" />
<br>
<img width="45%" alt="Q A - (관리자)문의 답변 노출" src="https://github.com/user-attachments/assets/fad1f9cb-607d-4925-a1c6-390a33747ac4" />
<img width="45%" alt="Q A - (관리자)문의 답변 등록 완료 알림" src="https://github.com/user-attachments/assets/e6ccf120-16b6-42aa-afd9-dd0e054f7dfc" />
<img width="45%" alt="Q A - (관리자)문의 답변 수정 완료 페이지" src="https://github.com/user-attachments/assets/2610a0e6-de50-445d-be59-cfc8878ee142" />

</details>

<br>

### 공지사항 (관리자 전용 CRUD)

https://github.com/user-attachments/assets/90a01640-8e21-4369-bad4-d7e3fcfceb64

<div align="center">

| 기능 | 설명 | 화면 |
|------|------|------|
| 공지 등록 | 관리자만 공지 작성 가능 | <img width="250" src="https://github.com/user-attachments/assets/6c0e647e-4b0d-4756-8b44-05ee50db9c09" /> |
| 공지 상세 | 사용자 누구나 열람 가능 | <img width="250" src="https://github.com/user-attachments/assets/fec73c6a-d364-4fa6-b0c5-671c59987530" /> |
| 공지 수정/삭제 | 관리자 권한 확인 후 수정 및 삭제 가능 | <img width="250" src="https://github.com/user-attachments/assets/66877d4a-49b7-4d4a-b875-ff5e20afe816" /> |

</div>

<br>

<details> 

<summary>📂 전체 화면 더보기</summary>
<img width="45%" alt="캘린더 - 등록 페이지" src="https://github.com/user-attachments/assets/5c91d1fc-f31a-4fc9-b69f-ee2062612a91" />
<img width="45%" alt="캘린더 - 리스트" src="https://github.com/user-attachments/assets/eef3cd5d-ef63-43e5-97db-09a4e31b49e1" />
<img width="45%" alt="캘린더 - 상세페이지(하단)" src="https://github.com/user-attachments/assets/e5643603-e303-410e-941a-5a10ad9c83d1" />
<img width="45%" alt="캘린더 - 상세페이지(하단, 관리자 외)" src="https://github.com/user-attachments/assets/f7954439-d9f0-4536-afd2-e60e8526c1b3"

</details>
  
<br>

## 📝 회고

### 📚 프로젝트 성과

- JWT 인증/인가와 Spring Security FilterChain 동작 원리를 이해하고 적용.
    - `JwtAuthFilter`를 직접 구현하여 토큰 검증 → SecurityContext 반영 → 권한(Role) 기반 접근 제어 흐름을 이해 및 적용.
    - 보안 아키텍처의 핵심 원리를 실습하며 Spring Security 구조에 대한 이해도 강화.

- 마이크로서비스 연동을 통해 독립 배포 가능한 AI 기능 구현 경험 확보.
  - Flask 기반 AI 감성 분석 서비스를 별도 서버로 구축 후 `Spring Boot`와 `REST API`로 연동.
  - 독립 배포 및 확장이 가능한 구조를 경험하며 MSA 아키텍처의 장점 체득.

- DB 설계 및 정규화 경험
  - 사용자, 게시판, 리뷰, 공지 등 실제 서비스 요구사항을 반영한 테이블과 관계를 설계.
  - 외래키 제약조건과 ENUM 타입을 활용해 데이터 무결성과 일관성을 보장하며 ERD 기반 모델링 능력 강화.

- ERD → JPA 매핑 및 N+1 문제 해결
  - 연관관계 매핑, 즉시/지연 로딩 전략, fetch join, EntityGraph를 적용하며 ORM 최적화 경험.
  - N+1 문제를 직접 마주하고 해결하며 `데이터 접근 최적화` 역량 강화.

- Postman을 활용한 `API 문서화`와 공유까지 협업 친화적 문서 작성법 학습.
  - Postman 컬렉션 공유 및 자동 문서화 기능을 활용해 실시간 업데이트 가능한 API 레퍼런스 구축.

### 개선할 점

- 파일 업로드 로컬 저장 → AWS S3 등 클라우드 스토리지 전환 필요.

- AI 모델은 공개 Hugging Face 모델 사용 → 서비스 특화 파인튜닝 고려.

- 테스트 코드 커버리지가 낮음 → JUnit + MockMvc 기반 확대 예정.

- 배포 자동화(CI/CD) 및 Docker/K8s 기반 운영 환경 개선 필요.
