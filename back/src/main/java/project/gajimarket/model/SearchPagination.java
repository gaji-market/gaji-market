package project.gajimarket.model;

import lombok.Data;

@Data
public class SearchPagination {

    private int totalCount; //전체 글 개수
    private int totalPage; //전체 페이지 수 (하단 페이지 수)
    private int recordPage; //페이지당 보여줄 글 개수
    private int currentPage; //현재 페이지

    private int searchType; //검색 유형
    private String searchKeyword; //검색 키워드
}
