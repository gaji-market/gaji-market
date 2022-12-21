package project.gajimarket.model;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class SearchPagination {

    @Setter(AccessLevel.NONE) //해당 변수의 setter custom
    private int totalRecordCount; //전체 글 개수

    @Getter(AccessLevel.NONE) //해당 변수의 getter custom
    private int totalPageCount; //전체 페이지 수

    private int currentPage; //현재 페이지
    private int recordCount; //페이지당 보여줄 글 개수
    private int pageCount; //하단에 보여줄 페이지 개수

    @Getter(AccessLevel.NONE) //해당 변수의 getter custom
    private int limitPage; //페이징 가져올 시작 시점(개수)

    //private boolean prevPage; //이전 페이지 여부
    //private boolean nextPage; //다음 페이지 여부

    private int searchType; //검색 유형

    private String sort; // 게시글 정렬
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
        //getTotalPageCount();
    }
    public int getTotalPageCount() {
        if (totalRecordCount > 0) {
            totalPageCount = ((totalRecordCount-1) / recordCount) + 1;
        }
        return totalPageCount;
    }
}
