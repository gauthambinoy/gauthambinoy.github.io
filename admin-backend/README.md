# Portfolio Admin Backend

Express.js backend for managing Gautham's portfolio content. Provides CRUD API endpoints to manage portfolio data stored in `portfolio-data.json`.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your admin token:
```
PORT=5000
ADMIN_TOKEN=your-secure-token-here
```

## Running

Development (with auto-reload):
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

### Public (No Auth Required)

- `GET /api/portfolio` - Get all portfolio data
- `GET /api/portfolio/:section` - Get specific section (e.g., `/api/portfolio/experience`)
- `GET /health` - Health check

### Protected (Requires Auth)

All protected endpoints require `Authorization: Bearer <ADMIN_TOKEN>` header.

**Update entire section:**
```bash
POST /api/portfolio/:section
Content-Type: application/json
Authorization: Bearer your-token

{
  "field": "value"
}
```

**Update specific item (array sections):**
```bash
PUT /api/portfolio/:section/:id
Content-Type: application/json
Authorization: Bearer your-token

{
  "field": "new-value"
}
```

**Add new item (array sections):**
```bash
POST /api/portfolio/:section/item
Content-Type: application/json
Authorization: Bearer your-token

{
  "company": "New Company",
  "role": "Role"
}
```

**Delete item:**
```bash
DELETE /api/portfolio/:section/:id
Authorization: Bearer your-token
```

## Examples

### Update Experience
```bash
curl -X PUT http://localhost:5000/api/portfolio/experience/1 \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"company": "New Company"}'
```

### Add Education
```bash
curl -X POST http://localhost:5000/api/portfolio/education/item \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "school": "New University",
    "degree": "MSc",
    "field": "Computer Science",
    "period": "2024-2025"
  }'
```

### Get All Skills
```bash
curl http://localhost:5000/api/portfolio/skills
```

## Data Structure

The backend reads/writes from `portfolio-data.json` which contains:
- `profile` - Basic profile info
- `social` - Social media links
- `experience` - Array of work experiences
- `education` - Array of education entries
- `skills` - Skills grouped by category
- `projects` - Array of projects
- `top_skills` - Featured skills

## Deployment

Deploy to Vercel (recommended):
```bash
vercel
```

Or deploy to any Node.js hosting (Heroku, Railway, Render, etc.).

## Security Notes

- Always change `ADMIN_TOKEN` in production
- Use environment variables for sensitive data
- Validate all incoming data
- Consider rate limiting for production
- CORS is enabled for all origins (configure as needed)
