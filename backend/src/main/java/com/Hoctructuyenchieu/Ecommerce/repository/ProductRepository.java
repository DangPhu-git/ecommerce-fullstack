package com.Hoctructuyenchieu.Ecommerce.repository;

import com.Hoctructuyenchieu.Ecommerce.entity.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdWithLock(@Param("id") Long id);

    List<Product> findByCategoryId(Long categoryId);

    Page<Product> findByIsFeaturedTrue(Pageable pageable);

    @Query("""
                SELECT p FROM Product p
                WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    Page<Product> findByKeyword(
            @Param("keyword") String keyword,
            Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId")
    Page<Product> findByCategoryId_(@Param("categoryId") Long categoryId, Pageable pageable);

    @Query("""
                SELECT p FROM Product p
                WHERE (
                    LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
                )
                AND p.category.id = :categoryId
            """)
    Page<Product> findByKeywordAndCategoryId(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            Pageable pageable);
}
