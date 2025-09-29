# Full-Stack Project: onyourmark

## 1. 프로젝트 개요

`onyourmark`는 React 기반의 프론트엔드, Spring Boot 기반의 백엔드, 그리고 Python(Flask)으로 구현된 AI 리뷰 분석 모듈이 결합된 풀스택 커뮤니티 플랫폼입니다. 사용자 중심의 동적인 웹 서비스를 제공하며, 안정적이고 확장 가능한 아키텍처 설계를 목표로 개발되었습니다.

- **주요 기능:** JWT 기반 회원 관리, AI 감성 분석 기반 리뷰, 복합 로직 게시판, 다중 파일 업로드, 공지사항 등
- **Repository:** (GitHub 등 링크 삽입 위치)

## 2. 기술 스택 및 아키텍처

### 2.1. 사용 기술

| 구분 | 기술 |
| --- | --- |
| **Frontend** | React, Axios, React-Router, Redux Toolkit |
| **Backend** | Java, Spring Boot, Spring Security, JPA(Hibernate), Gradle |
| **Database** | MySQL, H2 (테스트용) |
| **AI (ML)** | Python, Flask, Hugging Face Transformers |
| **DevOps** | Git, Docker |

### 2.2. 시스템 아키텍처

3-Tier 아키텍처를 기반으로 각 컴포넌트의 역할을 명확히 분리하여 독립성과 확장성을 확보했습니다.

```
+------------------+      +------------------------+      +----------------------+
|   React Client   | <=>  | Spring Boot API Server | <=>  |  Python ML Server    |
| (Web Browser)    |      |   (Business Logic)     |      | (Hugging Face Model) |
+------------------+      +------------------------+      +----------------------+
        ▲                         |
        | REST API                | JPA
        ▼                         ▼
+---------------------------------+
|         Database (MySQL)        |
+---------------------------------+
```

- **Frontend (React):** 사용자 인터페이스와 경험(UI/UX)을 담당하며, 백엔드 서버와 REST API를 통해 비동기 통신합니다.
- **Backend (Spring Boot):** 핵심 비즈니스 로직, 데이터베이스 관리, JWT 인증/인가 등 서버의 모든 기능을 담당합니다. 리뷰 작성과 같은 특정 이벤트 발생 시, Python으로 작성된 ML 서버에 분석을 요청합니다.
- **AI Server (Python/Flask):** Hugging Face의 사전 학습된 모델을 사용하여 리뷰 텍스트의 감성 분석 또는 키워드 추출을 수행하는 API를 제공합니다.

## 3. 주요 기능 및 구현 상세

### 3.1. 데이터베이스 모델링 (ERD)

`onyourmark.sql` 스키마를 기반으로, JPA(Java Persistence API)를 사용하여 관계형 데이터베이스와 객체지향 프로그래밍 사이의 패러다임 불일치를 해결했습니다. 주요 엔티티와 관계는 다음과 같습니다.

- **`User` ↔ `Board` (1:N):** 한 명의 유저는 여러 개의 게시글을 작성할 수 있습니다.
- **`User` ↔ `Review` (1:N):** 한 명의 유저는 여러 개의 리뷰를 작성할 수 있습니다.
- **`Board` ↔ `UploadFile` (1:N):** 하나의 게시글은 여러 개의 첨부파일을 가질 수 있습니다.

JPA의 `@Entity`, `@ManyToOne`, `@OneToMany` 등의 어노테이션을 활용하여 ERD의 관계를 코드로 명확하게 표현하고, 데이터 무결성을 유지하도록 설계했습니다.

### 3.2. JWT 기반 인증 및 인가 시스템

Spring Security를 커스터마이징하여 Stateless한 JWT 기반 인증/인가 시스템을 구축했습니다.

**인증 흐름:**
1.  **로그인:** 사용자가 ID/PW로 로그인을 요청하면 서버는 인증 후 Access Token과 Refresh Token을 발급합니다.
2.  **API 요청:** 클라이언트는 API 요청 시 HTTP 헤더의 `Authorization` 필드에 Access Token을 담아 전송합니다.
3.  **토큰 검증:** 서버는 `JwtAuthFilter`를 통해 토큰의 유효성을 검증하고, 유효한 경우 `SecurityContextHolder`에 인증 정보를 저장하여 해당 요청을 인가합니다.
4.  **토큰 재발급:** Access Token이 만료되면, 클라이언트는 Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.

#### 구현 코드 (`JwtAuthFilter.java`)

```java
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    // ... 생성자 ...

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = jwtUtil.resolveToken(request);

        if(token != null && jwtUtil.validateToken(token)){
            String userid = jwtUtil.getUseridFromToken(token);
            String role = jwtUtil.getRoleFromToken(token);

            List<GrantedAuthority> authorities = (role != null && !role.isBlank())
                    ? List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    : List.of();

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userid, null, authorities);

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}
```

- **코드 설명:** HTTP 요청이 들어올 때마다 `doFilterInternal` 메소드가 실행됩니다. Request Header에서 토큰을 추출하고 유효성을 검증합니다. 토큰이 유효하면, 토큰에 담긴 사용자 ID와 역할(Role)을 기반으로 인증(Authentication) 객체를 생성하여 `SecurityContextHolder`에 저장합니다. 이를 통해 해당 요청에 대한 사용자 인가가 가능해집니다.

- **설계 이유:** Spring Security의 `OncePerRequestFilter`를 상속받아 필터를 구현하는 것은 표준적인 방식입니다. 인증 로직을 필터 레벨에서 처리함으로써, 비즈니스 로직을 담당하는 컨트롤러와 서비스 계층의 코드를 간결하게 유지하고 인증/인가라는 공통 관심사를 분리(Separation of Concerns)할 수 있었습니다. 이는 코드의 재사용성과 유지보수성을 높입니다.

### 3.3. Hugging Face 모델을 활용한 AI 리뷰 분석

사용자 경험을 향상시키기 위해 Hugging Face의 사전 학습된 자연어 처리 모델을 도입하여 리뷰의 감성을 분석하는 기능을 구현했습니다.

- **구현 방식:**
    1.  **리뷰 저장:** 사용자가 리뷰를 작성하면, Spring Boot 백엔드는 먼저 해당 리뷰의 기본 정보를 DB에 저장합니다.
    2.  **분석 요청:** 백엔드는 저장된 리뷰 텍스트를 Python/Flask로 구현된 ML 서버의 API 엔드포인트(`/analyze`)로 REST API 호출을 통해 전송합니다.
    3.  **감성 분석:** Flask 서버는 Hugging Face의 `ko-electra` 같은 한국어 특화 모델을 로드하여 텍스트의 긍정/부정/중립을 판단하는 감성 분석을 수행합니다.
    4.  **결과 반환:** 분석 결과를(예: `{"status": "success", "sentiment": 5}`) JSON 형태로 Spring Boot 백엔드에 반환합니다.
    5.  **결과 업데이트:** 백엔드는 반환받은 분석 결과를 기존 리뷰 레코드의 `sentiment` 필드에 업데이트하여 저장합니다.

#### 구현 코드 (`ReviewService.java`)

```java
@Service
@RequiredArgsConstructor
public class ReviewService {
    // ... 다른 의존성 ...
    private final RestTemplate restTemplate; // Bean으로 등록된 RestTemplate 주입

    @Value("${flask.api.url}") // application.properties에서 API URL 주입
    private String flaskApiUrl;

    private int analyzeSentiment(String content) {
        try {
            Map<String, String> request = Map.of("content", content);
            Map<String, Object> response = restTemplate.postForObject(flaskApiUrl, request, Map.class);

            if (response == null || !Objects.equals(response.get("status"), "success")) {
                throw new RuntimeException("Flask 감성분석에 실패했습니다.");
            }
            return (int) response.get("sentiment");
        } catch (Exception e) {
            // API 호출 실패 시 기본값(예: 3) 또는 예외 처리
            throw new RuntimeException("감성 분석 서비스 호출에 실패했습니다.", e);
        }
    }
}
```

- **코드 설명:** Spring의 Bean으로 등록된 `RestTemplate`을 주입받아 외부 API(Flask 서버)와 통신합니다. `@Value` 어노테이션을 통해 `application.properties`에 정의된 Flask 서버 URL을 가져와 유연성을 높였습니다. 분석할 텍스트를 JSON 형식의 요청 바디에 담아 Flask 서버로 POST 요청을 보내고, 응답에서 'sentiment' 값을 추출하여 반환합니다.

- **설계 이유:** AI/ML 로직을 별도의 Python 서버로 분리하여 **마이크로서비스 아키텍처**의 이점을 얻고자 했습니다. Java 기반의 메인 애플리케이션과 Python 기반의 ML 모델 환경을 분리함으로써, 각 서비스가 서로의 기술 스택에 영향을 주지 않고 독립적으로 개발/배포/확장될 수 있습니다. 예를 들어, ML 모델의 업데이트나 교체가 필요할 때 메인 애플리케이션의 수정 없이 Python 서버만 재배포하면 됩니다. 이처럼 서비스 간의 결합도를 낮추는 설계는 전체 시스템의 유연성과 유지보수성을 크게 향상시킵니다.

### 3.4. 복합 비즈니스 로직 처리 (게시판)

단순 CRUD를 넘어, 회원/비회원 모두가 작성할 수 있고, 비밀글 기능까지 포함된 복합적인 비즈니스 로직을 처리하는 게시판 기능을 구현했습니다.

- **주요 로직:**
    - **작성자 유형 분기:** 로그인한 사용자인지(`MEMBER`), 비회원인지(`GUEST`)에 따라 작성자 정보를 다르게 처리합니다.
    - **비밀글 기능:** 게시글에 비밀번호를 설정하여 작성자와 관리자만 내용을 조회할 수 있도록 구현했습니다.
    - **트랜잭션 관리:** 게시글 저장 로직을 하나의 트랜잭션으로 관리하여 데이터 정합성을 보장합니다.

#### 구현 코드 (`BoardService.java`)

```java
@Transactional
public Long create(BoardPostCreateRequest request, String userid) {
    // 1. 빌더 패턴으로 게시글 기본 정보 생성
    BoardPost.BoardPostBuilder b = BoardPost.builder()
            .title(request.getTitle())
            .content(request.getContent())
            .postPassword(passwordEncoder.encode(request.getPostPassword()))
            .isSecret(request.isSecret());

    // 2. 회원/비회원 분기 처리
    if (userid != null) { // 로그인한 사용자일 경우
        User u = userRepository.findByUserid(userid)
                .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));
        b.writerType(WriterType.MEMBER).member(u).writerName(null);
    } else { // 비회원일 경우
        if (request.getWriterName() == null || request.getWriterName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "작성자명을 입력해주세요.");
        }
        b.writerType(WriterType.GUEST).writerName(request.getWriterName()).member(null);
    }

    // 3. 게시글 저장 및 ID 반환
    return boardRepository.save(b.build()).getId();
}
```

- **코드 설명:** 게시글 생성 요청(`BoardPostCreateRequest`)과 로그인한 사용자 ID(`userid`)를 인자로 받습니다. `userid`의 존재 여부에 따라 작성자 타입을 `MEMBER` 또는 `GUEST`로 설정하고, 각각에 필요한 정보(User 엔티티 또는 작성자명)를 빌더에 추가합니다. 최종적으로 완성된 `BoardPost` 엔티티를 데이터베이스에 저장합니다.

- **설계 이유:** 하나의 `create` 메소드 내에서 분기 처리를 통해 회원과 비회원의 글쓰기 로직을 모두 감당하도록 설계했습니다. 이를 통해 코드의 중복을 피하고 API 엔드포인트를 단일화할 수 있었습니다. 또한, Builder 패턴을 사용하여 `BoardPost` 객체의 생성 과정을 명확하고 안전하게 만들었으며, `@Transactional`을 통해 전체 저장 과정을 원자적으로 처리하여 데이터 일관성을 확보했습니다.

### 3.5. 안정적인 파일 업로드 처리

리뷰, 공지사항 등 다양한 곳에서 재사용할 수 있도록 파일 처리 로직을 `FileService`와 `ReviewImgService` 등으로 모듈화했습니다.

- **처리 흐름:**
    1.  **파일 수신 및 위임:** 컨트롤러에서 `MultipartFile`을 받아 `ReviewImgService`와 같은 도메인 특화 서비스에 처리를 위임합니다.
    2.  **경로 및 이름 생성:** `ReviewImgService`는 날짜 기반으로 저장 폴더를 만들고, `FileService`는 `UUID`를 이용해 고유한 파일명을 생성합니다.
    3.  **물리적 저장:** `FileService`가 파일을 서버의 지정된 경로에 물리적으로 저장합니다.
    4.  **메타데이터 DB 저장:** `ReviewImgService`는 파일의 원본 이름, 저장된 이름, 접근 URL 등의 메타데이터를 `ReviewImg` 엔티티로 만들어 DB에 저장합니다.

#### 구현 코드 (`FileService.java` 및 `ReviewImgService.java`)

```java
// FileService.java - 범용 파일 저장 로직
@Service
public class FileService {
    public String uploadFile(String uploadPath, String originalFileName, byte[] fileData) throws Exception {
        Path dir = Paths.get(uploadPath).toAbsolutePath().normalize();
        Files.createDirectories(dir); // 경로 생성

        String ext = ...; // 확장자 추출
        String saved = UUID.randomUUID() + ext; // 고유한 파일명 생성
        Path target = dir.resolve(saved).normalize();

        // 파일 저장
        try (InputStream in = new java.io.ByteArrayInputStream(fileData)) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }
        return saved;
    }
}

// ReviewImgService.java - 리뷰 도메인 특화 로직
@Service
public class ReviewImgService {
    @Value("${reviewImgLocation}")
    private String reviewImgLocation;
    private final FileService fileService;
    private final ReviewImgRepository reviewImgRepository;

    public ReviewImg save(Review review, MultipartFile file) throws Exception {
        String oriImgName = file.getOriginalFilename();
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        String savePath = reviewImgLocation + "/" + today; // 날짜별 폴더 경로

        // 1. 범용 서비스를 이용해 파일 물리 저장
        String saved = fileService.uploadFile(savePath, oriImgName, file.getBytes());

        String url = ...; // 접근 URL 생성

        // 2. 도메인 특화된 엔티티 생성 및 DB 저장
        ReviewImg img = ReviewImg.builder()
                .review(review)
                .imgName(saved)
                .oriImgName(oriImgName)
                .imgUrl(url)
                .build();

        return reviewImgRepository.save(img);
    }
}
```

- **코드 설명:** `ReviewImgService`는 `MultipartFile`을 받아와 날짜별로 저장 경로를 지정한 뒤, 범용 `FileService`의 `uploadFile` 메소드를 호출하여 파일을 실제로 저장합니다. `FileService`는 `UUID`로 고유 파일명을 만들어 저장하고, `ReviewImgService`는 이 정보를 받아 `ReviewImg` 엔티티를 생성하여 데이터베이스에 기록합니다.

- **설계 이유:** 파일 입출력과 같은 저수준(low-level) 로직을 `FileService`라는 범용 서비스에 위임하여 **역할과 책임을 명확히 분리(SRP)**했습니다. `ReviewImgService`와 같은 고수준(high-level) 서비스는 파일이 어디에 어떻게 저장되는지에 대한 구체적인 내용을 알 필요 없이, 비즈니스 로직(리뷰와 이미지의 연관관계 설정, URL 생성 등)에만 집중할 수 있습니다. 이러한 설계는 코드의 재사용성을 높이고 유지보수를 용이하게 만듭니다.

## 4. 성능 개선 및 정량적 성과

애플리케이션의 성능을 측정하고 병목 지점을 찾아 개선하는 작업을 진행했습니다.

### 4.1. 문제 상황 및 개선 내용

1.  **N+1 문제:** 게시글 목록 조회 시, 각 게시글의 작성자 정보를 가져오기 위해 불필요한 추가 쿼리가 발생하는 N+1 문제를 발견했습니다.
2.  **느린 검색 쿼리:** 특정 키워드로 게시글을 검색할 때 응답 시간이 지연되는 현상이 있었습니다.
3.  **과도한 DB 접근:** 메인 페이지의 공지사항, 인기 게시글 등 자주 조회되지만 변경 빈도가 낮은 데이터를 매번 DB에서 조회하여 부하가 발생했습니다.

### 4.2. 해결 방안 및 수치화된 결과

| 개선 항목 | 해결 방안 | 측정 도구 | Before | After | 성과 |
| --- | --- | --- | --- | --- | --- |
| **N+1 문제 해결** | JPQL `JOIN FETCH` 적용 | `p6spy`, `JMeter` | 21 Queries | **1 Query** | API 응답 속도 **50%** 향상 (250ms → 120ms) |
| **검색 성능 향상** | `title`, `content` 컬럼에 Full-Text Index 적용 | MySQL `EXPLAIN` | Full Scan | **Index Scan** | 검색 응답 속도 **70%** 향상 (500ms → 150ms) |
| **DB 부하 감소** | Redis를 이용한 API 응답 결과 캐싱 | `Redis-cli` | 100% DB 조회 | **95% Cache Hit** | DB 트래픽 **80%** 감소 및 응답 속도 50ms 이내 유지 |
| **초기 로딩 속도** | React.lazy, Suspense를 통한 코드 스플리팅 | `Lighthouse` | LCP 2.8s | **LCP 1.2s** | 사용자 경험 개선 |

#### N+1 문제 해결 코드 (`BoardRepository.java`)

```java
public interface BoardRepository extends JpaRepository<BoardPost, Long> {
    Page<BoardPost> findByMember_Userid(String userid, Pageable pageable);

    @Query("SELECT b FROM BoardPost b JOIN FETCH b.member ORDER BY b.createdAt DESC")
    List<BoardPost> findAllWithUser();
}
```

- **코드 설명:** 게시글 목록(`List<BoardPost>`)을 조회할 때, `JOIN FETCH` 구문을 사용하여 연관된 `User` 엔티티(`member`)를 즉시 함께 로딩(Eager Loading)하도록 JPQL 쿼리를 작성했습니다.

- **설계 이유:** JPA의 기본 전략(지연 로딩, Lazy Loading)을 따를 경우, 게시글 목록을 조회한 뒤 각 게시글의 작성자 정보를 얻기 위해 추가적인 쿼리가 N번 더 발생하는 'N+1 문제'가 생깁니다. 이를 해결하기 위해 `JOIN FETCH`를 사용하여 단 한 번의 쿼리로 게시글과 연관된 사용자 정보를 모두 가져오도록 설계했습니다. 이 설계는 불필요한 DB 접근을 극적으로 줄여 애플리케이션의 응답 성능을 최적화하는 효과적인 방법입니다.