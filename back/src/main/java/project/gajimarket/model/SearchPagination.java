package project.gajimarket.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Schema(description = "검색 & 페이징 클래스")
@Data
public class SearchPagination {

    @Schema(description = "전체 글 개수")
    @Setter(AccessLevel.NONE) //해당 변수의 setter custom
    private int totalRecordCount; //전체 글 개수

    @Schema(description = "(하단의) 전체 페이지 수")
    @Getter(AccessLevel.NONE) //해당 변수의 getter custom
    private int totalPageCount; //전체 페이지 수

    @Schema(description = "현재 페이지", defaultValue = "1", example = "1")
    private int currentPage; //현재 페이지

    @Schema(description = "페이지당 보여줄 글의 개수", defaultValue = "10", example = "10")
    private int recordCount; //페이지당 보여줄 글 개수

    @Schema(description = "하단에 보여줄 페이지 개수", defaultValue = "5", example = "5")
    private int pageCount; //하단에 보여줄 페이지 개수

    @Schema(description = "페이징 가져올 시작 시점(개수)")
    @Getter(AccessLevel.NONE) //해당 변수의 getter custom
    private int limitPage; //페이징 가져올 시작 시점(개수)

    //private boolean prevPage; //이전 페이지 여부
    //private boolean nextPage; //다음 페이지 여부

    @Schema(description = "검색 조건")
    private int searchType; //검색 유형
    @Schema(description = "정렬")
    private String sort; // 게시글 정렬
    @Schema(description = "검색 키워드")
    private String search; // 검색어

    public SearchPagination() {
        currentPage = 1;
        recordCount = 10;
        pageCount = 5;
    }

    public SearchPagination(int recordCount, int pageCount) {
        currentPage = 1;
        this.recordCount = recordCount;
        this.pageCount = pageCount;
    }

    //limit 시작 위치
    public int getLimitPage() {
        return (currentPage - 1) * recordCount;
    }

//    public boolean prevPage() {
//        if (currentPage <= pageCount) {
//            return false;
//        }
//        return true;
//    }
//
//    public boolean nextPage() {
//        if (currentPage ) {
//            return false;
//        }
//        return true;
//    }

    public void setTotalRecordCount(final int totalRecordCount) {
        this.totalRecordCount = totalRecordCount;
    }
    public int getTotalPageCount() {
        if (totalRecordCount > 0) {
            totalPageCount = ((totalRecordCount-1) / recordCount) + 1;
        }
        return totalPageCount;
    }
}
