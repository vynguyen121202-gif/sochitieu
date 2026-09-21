# Bộ kiểm tra và máy chủ xem thử

`app.js` chạy được dưới Node với DOM giả, nên kiểm tra được từng con số mà
không cần mở trình duyệt. Tiền lệ và cách làm ghi trong `CLAUDE.md`.

## Chạy kiểm tra

```
node kiemtra/chay-tat-ca.js
```

| File | Kiểm cái gì |
|---|---|
| `kt-tongquan.js` | Tab Tổng quan: công thức, thứ tự khối, màu, nền, tháng cũ |
| `kt-nhap-tong.js` | Tab Nhập: dòng tổng, chọn / bỏ chọn tất cả |
| `kt-nhap-loi.js` | Tab Nhập: báo dòng dán hỏng, câu lệnh AI ở Cài đặt |
| `kt-nhac-ghi-so.js` | Khối nhắc khi sổ lâu chưa cập nhật |

Mỗi bài dựng `Date` giả nên kết quả không đổi theo ngày chạy.
`so-mau.js` sinh sổ mẫu bằng hạt giống cố định — chạy bao nhiêu lần cũng ra
đúng một sổ, nên số liệu trong bài kiểm tra so sánh được.

## Xem thử trên trình duyệt

```
node kiemtra/server-so-that.js    # cổng 8765 — SỔ THẬT của Vy
node kiemtra/server-so-mau.js     # cổng 8767 — sổ mẫu, mở /nap một lần để nạp
```

Hai cổng khác nhau là **cố ý**: kho dữ liệu của trình duyệt tách theo cổng,
nên nghịch sổ mẫu ở 8767 không bao giờ đụng được vào sổ thật ở 8765, cũng
không đụng bản trên điện thoại.

Sổ mẫu cố ý để trống 3 ngày gần nhất để thấy khối nhắc ghi sổ.

## Khi thêm công thức mới

Theo rule `.claude/rules/calculations.md`: đưa ví dụ bằng số cho Vy duyệt
trước, viết code sau, rồi thêm điểm kiểm vào đây và cập nhật mảng `R` trong
`vInfo()`. Bài kiểm tra nên có cả **điểm canh ngược** — thứ gì KHÔNG được
xuất hiện — vì phần lớn lỗi bắt được trong dự án này là loại đó.
