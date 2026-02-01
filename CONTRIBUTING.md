# Contributing to Mini GrabFood

ขอบคุณที่สนใจ contribute โปรเจค Mini GrabFood! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

โปรเจคนี้เป็นแบบ open และ friendly กับทุกคน กรุณา:
- 🤝 เคารพความเห็นที่แตกต่าง
- 💬 ใช้ภาษาที่สุภาพ
- 🎯 มุ่งเน้นที่จะพัฒนาโปรเจคให้ดีขึ้น
- ⭐ ให้ feedback แบบสร้างสรรค์

---

## Getting Started

### 1. Fork & Clone

```bash
# Fork repository บน GitHub
# แล้ว clone มาที่เครื่องของคุณ
git clone https://github.com/YOUR_USERNAME/mini-grabfood.git
cd mini-grabfood
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Setup Database

```bash
mysql -u root -p < backend/database/schema.sql
```

### 4. Configure Environment

```bash
cd backend
cp .env.example .env
# แก้ไข .env ตามต้องการ
```

### 5. Run Development Server

```bash
npm run dev
```

---

## How to Contribute

### 🐛 Reporting Bugs

เจอ bug? ช่วย report ด้วย:

1. เช็คว่ามี issue อยู่แล้วหรือยัง
2. สร้าง issue ใหม่พร้อม:
   - ชื่อที่ชัดเจน
   - คำอธิบายละเอียด
   - ขั้นตอนการทำให้เกิด bug
   - Expected vs Actual behavior
   - Screenshots (ถ้ามี)
   - Environment (OS, Browser, Node version)

### 💡 Suggesting Features

มีไอเดียใหม่? แชร์กับเรา:

1. สร้าง issue ด้วย label `enhancement`
2. อธิบายว่า feature นี้ทำอะไร
3. อธิบายว่าทำไมมันมีประโยชน์
4. ให้ตัวอย่างการใช้งาน

### 🔧 Contributing Code

1. หา issue ที่ต้องการทำ (ดู label `good first issue`)
2. Comment บอกว่าจะทำ issue นั้น
3. Fork & create branch
4. Code & test
5. Submit pull request

---

## Development Workflow

### Branch Naming Convention

```bash
feature/add-user-authentication
bugfix/fix-rating-validation
hotfix/critical-security-issue
docs/update-readme
refactor/improve-api-structure
```

### Creating a Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create new branch
git checkout -b feature/your-feature-name
```

---

## Coding Standards

### JavaScript/React

```javascript
// ✅ Good
function RestaurantCard({ restaurant, onClick }) {
  return (
    <div className="restaurant-card" onClick={onClick}>
      <h2>{restaurant.name}</h2>
    </div>
  );
}

// ❌ Bad
function restaurantcard(r, o) {
  return <div className="rc" onClick={o}><h2>{r.n}</h2></div>
}
```

### Key Points

- ✅ ใช้ชื่อตัวแปรที่มีความหมาย
- ✅ Component names ใช้ PascalCase
- ✅ Function names ใช้ camelCase
- ✅ เขียน comments สำหรับโค้ดที่ซับซ้อน
- ✅ แยก component ย่อยเมื่อ component ใหญ่เกินไป
- ✅ ใช้ async/await แทน promise chains
- ✅ Handle errors ทุกครั้ง

### CSS/Styling

```css
/* ✅ Good - มีการจัดกลุ่ม */
.restaurant-card {
  /* Layout */
  display: flex;
  flex-direction: column;
  
  /* Box model */
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  
  /* Visual */
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  /* Animation */
  transition: transform 0.2s;
}

/* ❌ Bad - ไม่มีการจัดระเบียบ */
.rc{padding:1rem;background:white;border:1px solid #eee;margin-bottom:1rem;}
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: Feature ใหม่
- `fix`: แก้ bug
- `docs`: เปลี่ยน documentation
- `style`: Code formatting (ไม่เปลี่ยนตัว code)
- `refactor`: Code refactoring
- `test`: เพิ่ม tests
- `chore`: การเปลี่ยนแปลง build process

### Examples

```bash
# Good commits
git commit -m "feat(restaurants): add search functionality"
git commit -m "fix(ratings): validate score range 1-5"
git commit -m "docs(readme): update installation steps"
git commit -m "refactor(api): improve error handling"

# Bad commits
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

### Detailed Example

```
feat(authentication): add JWT-based user authentication

- Implement login endpoint
- Add JWT token generation
- Create authentication middleware
- Add protected routes

Closes #123
```

---

## Pull Request Process

### 1. Before Submitting

- ✅ รัน `npm run lint` (ถ้ามี)
- ✅ Test ในเครื่องของคุณ
- ✅ เขียน/อัพเดท tests
- ✅ อัพเดท documentation ถ้าจำเป็น
- ✅ Commit messages ตาม convention

### 2. Create Pull Request

1. Push branch ขึ้น GitHub
   ```bash
   git push origin feature/your-feature-name
   ```

2. ไปที่ GitHub และสร้าง Pull Request

3. เขียน PR description ที่ดี:
   ```markdown
   ## What does this PR do?
   เพิ่มระบบค้นหาร้านอาหารด้วย fuzzy search
   
   ## Changes
   - เพิ่ม search algorithm
   - อัพเดท UI ของ search box
   - เพิ่ม tests สำหรับ search functionality
   
   ## Screenshots (if applicable)
   ![search-feature](link-to-image)
   
   ## Related Issues
   Closes #45
   
   ## Checklist
   - [x] Tests added
   - [x] Documentation updated
   - [x] No breaking changes
   ```

### 3. PR Review Process

- 👀 รอ maintainers review
- 💬 ตอบ feedback และทำการแก้ไข
- ✅ รอ approval
- 🎉 Merge!

### 4. After Merge

```bash
# Update local main branch
git checkout main
git pull origin main

# Delete feature branch
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

## Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

### Writing Tests

```javascript
// Example test for API endpoint
describe('GET /api/restaurants', () => {
  it('should return all restaurants', async () => {
    const response = await request(app)
      .get('/api/restaurants')
      .expect(200);
    
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
```

---

## Need Help?

- 📖 อ่าน [README.md](README.md)
- 💬 สร้าง issue ถาม
- 📧 ติดต่อ maintainers

---

## Recognition

Contributors จะถูกเพิ่มใน:
- README.md (Contributors section)
- GitHub contributors graph
- Release notes

---

ขอบคุณสำหรับการ contribute! 🙏

Happy Coding! 💻✨