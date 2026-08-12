package com.Hoctructuyenchieu.Ecommerce.config;

import com.Hoctructuyenchieu.Ecommerce.entity.Category;
import com.Hoctructuyenchieu.Ecommerce.entity.Product;
import com.Hoctructuyenchieu.Ecommerce.entity.User;
import com.Hoctructuyenchieu.Ecommerce.repository.CategoryRepository;
import com.Hoctructuyenchieu.Ecommerce.repository.ProductRepository;
import com.Hoctructuyenchieu.Ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin & User if not present
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@ecommerce.com")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Quản Trị Viên")
                    .phone("0900000000")
                    .address("Hà Nội, Việt Nam")
                    .role(User.Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin);
        }

        if (!userRepository.existsByUsername("user")) {
            User user = User.builder()
                    .username("user")
                    .email("user@ecommerce.com")
                    .password(passwordEncoder.encode("user123"))
                    .fullName("Nguyễn Văn A")
                    .phone("0912345678")
                    .address("TP Hồ Chí Minh, Việt Nam")
                    .role(User.Role.ROLE_USER)
                    .build();
            userRepository.save(user);
        }

        // Seed Categories if empty
        if (categoryRepository.count() == 0) {
            Category electronics = categoryRepository.save(Category.builder()
                    .name("Điện thoại & Máy tính")
                    .slug("dien-thoai-may-tinh")
                    .description("Thiết bị công nghệ, điện thoại di động, laptop cao cấp")
                    .imageUrl("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80")
                    .build());

            Category fashion = categoryRepository.save(Category.builder()
                    .name("Thời trang Nam & Nữ")
                    .slug("thoi-trang")
                    .description("Quần áo, phụ kiện thời trang hiện đại")
                    .imageUrl("https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80")
                    .build());

            Category home = categoryRepository.save(Category.builder()
                    .name("Gia dụng & Đời sống")
                    .slug("gia-dung-doi-song")
                    .description("Đồ gia dụng thông minh cho ngôi nhà của bạn")
                    .imageUrl("https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80")
                    .build());

            Category accessories = categoryRepository.save(Category.builder()
                    .name("Phụ kiện Công nghệ")
                    .slug("phu-kien-cong-nghe")
                    .description("Tai nghe, sạc dự phòng, đồng hồ thông minh")
                    .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80")
                    .build());

            // Seed Products
            if (productRepository.count() == 0) {
                productRepository.save(Product.builder()
                        .name("iPhone 15 Pro Max 256GB")
                        .slug("iphone-15-pro-max-256gb")
                        .description("Khung Titan chuẩn hàng không vũ trụ, chip A17 Pro siêu mạnh mẽ, camera 48MP Zoom 5x.")
                        .price(new BigDecimal("32990000"))
                        .discountPrice(new BigDecimal("29990000"))
                        .stockQuantity(15)
                        .isFeatured(true)
                        .imageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80")
                        .category(electronics)
                        .build());

                productRepository.save(Product.builder()
                        .name("MacBook Pro 14 M3 Max")
                        .slug("macbook-pro-14-m3-max")
                        .description("Hiệu năng đỉnh cao với chip M3 Max 14-Core CPU, 30-Core GPU, màn hình Liquid Retina XDR 120Hz.")
                        .price(new BigDecimal("49990000"))
                        .discountPrice(new BigDecimal("46500000"))
                        .stockQuantity(8)
                        .isFeatured(true)
                        .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80")
                        .category(electronics)
                        .build());

                productRepository.save(Product.builder()
                        .name("Tai Nghe Sony WH-1000XM5")
                        .slug("tai-nghe-sony-wh-1000xm5")
                        .description("Chống ồn chủ động đỉnh cao thế giới, thời lượng pin 30 giờ, âm thanh Hi-Res Audio sắc nét.")
                        .price(new BigDecimal("8490000"))
                        .discountPrice(new BigDecimal("6990000"))
                        .stockQuantity(25)
                        .isFeatured(true)
                        .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80")
                        .category(accessories)
                        .build());

                productRepository.save(Product.builder()
                        .name("Đồng Hồ Apple Watch Series 9")
                        .slug("apple-watch-series-9")
                        .description("Tính năng Chạm hai lần độc đáo, màn hình sáng gấp đôi, theo dõi sức khỏe và nhịp tim chính xác.")
                        .price(new BigDecimal("10990000"))
                        .discountPrice(new BigDecimal("9490000"))
                        .stockQuantity(20)
                        .isFeatured(false)
                        .imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80")
                        .category(accessories)
                        .build());

                productRepository.save(Product.builder()
                        .name("Áo Khoác Blazer Nam Premium")
                        .slug("ao-khoac-blazer-nam-premium")
                        .description("Phong cách lịch lãm, chất liệu vải tuyết mưa nhập khẩu cao cấp, thoáng mát chuẩn form.")
                        .price(new BigDecimal("1250000"))
                        .discountPrice(new BigDecimal("890000"))
                        .stockQuantity(50)
                        .isFeatured(false)
                        .imageUrl("https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80")
                        .category(fashion)
                        .build());

                productRepository.save(Product.builder()
                        .name("Nồi Chiên Không Dầu Philips 6.2L")
                        .slug("noi-chien-khong-dau-philips-6-2l")
                        .description("Công nghệ Rapid Air giảm 90% lượng chất béo, điều khiển cảm ứng thông minh 8 chế độ.")
                        .price(new BigDecimal("3590000"))
                        .discountPrice(new BigDecimal("2790000"))
                        .stockQuantity(30)
                        .isFeatured(true)
                        .imageUrl("https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80")
                        .category(home)
                        .build());
            }
        }
    }
}
