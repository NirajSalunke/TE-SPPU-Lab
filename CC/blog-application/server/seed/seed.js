require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

const User = require('../models/User');
const Category = require('../models/Category');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const RESET = process.argv.includes('--reset');

const categories = [
  { name: 'Technology', description: 'Latest in tech, software, and gadgets' },
  { name: 'Design', description: 'UI/UX, graphic design, and creative tools' },
  { name: 'Development', description: 'Coding tutorials, frameworks, and best practices' },
  { name: 'Career', description: 'Tips for growing your professional life' },
  { name: 'Productivity', description: 'Workflows, tools, and mindset for peak performance' },
];

const postData = [
  {
    title: 'Getting Started with React 19',
    excerpt: 'React 19 brings major improvements including server components, improved hooks, and better performance out of the box.',
    content: `## Introduction\n\nReact 19 is here and it's packed with powerful new features that make building modern web apps even easier.\n\n## Server Components\n\nServer components allow you to render parts of your UI on the server, reducing the JavaScript bundle sent to the client.\n\n## New Hooks\n\nReact 19 introduces \`use()\` — a universal hook that lets you read resources like Promises and Context directly in render.\n\n## Improved Hydration\n\nHydration errors are now much more descriptive, making debugging a breeze.\n\n## Conclusion\n\nReact 19 is a massive step forward. Start experimenting with it today!`,
    category: 'Development', tags: ['react', 'javascript', 'frontend'], featured: true,
  },
  {
    title: 'Designing for Dark Mode: A Complete Guide',
    excerpt: 'Dark mode is no longer optional. Learn how to design beautiful dark interfaces that users actually enjoy.',
    content: `## Why Dark Mode Matters\n\nOver 80% of users prefer dark mode in low-light environments. Designing well for both modes is now a baseline expectation.\n\n## Color Theory for Dark Interfaces\n\nAvoid pure black (#000). Use dark grays with a slight hue (e.g., #0a0a0b) for more natural-looking dark backgrounds.\n\n## Contrast Ratios\n\nEnsure WCAG AA compliance (4.5:1 for normal text). Test your colors with tools like Contrast Checker.\n\n## Elevation via Lightness\n\nIn dark mode, use lighter shades to indicate higher elevation — the opposite of light mode shadows.\n\n## Conclusion\n\nDark mode done right creates a premium feel. Follow these principles and your users will thank you.`,
    category: 'Design', tags: ['design', 'dark-mode', 'ui', 'ux'], featured: true,
  },
  {
    title: 'Node.js Best Practices in 2025',
    excerpt: 'Scalable, maintainable Node.js apps start with the right architecture. Here are the patterns every developer should know.',
    content: `## Project Structure\n\nSeparate your concerns: routes, controllers, services, and models should each live in their own layer.\n\n## Error Handling\n\nAlways use a centralized error handler. Never swallow errors silently.\n\n## Environment Variables\n\nUse \`dotenv\` and never commit secrets. Provide a \`.env.template\` for collaborators.\n\n## Security\n\n- Use \`helmet\` for HTTP headers\n- Rate limit public endpoints\n- Validate all incoming data\n\n## Async/Await\n\nWrap async route handlers or use a utility like \`express-async-errors\` to avoid unhandled rejections.\n\n## Conclusion\n\nA clean Node.js architecture pays dividends as your app scales.`,
    category: 'Development', tags: ['nodejs', 'backend', 'javascript'], featured: false,
  },
  {
    title: 'MongoDB Schema Design Patterns',
    excerpt: 'Choosing the right data model in MongoDB can make or break your application. Learn the key patterns.',
    content: `## Embedding vs Referencing\n\nEmbed documents when data is read together frequently. Use references when data grows large or is shared across entities.\n\n## The Bucket Pattern\n\nPerfect for time-series data. Group multiple documents into "buckets" to reduce document count and improve query performance.\n\n## The Subset Pattern\n\nStore the most frequently accessed fields in the main document and the rest in a companion document.\n\n## Indexing Strategy\n\nAlways index fields used in queries, sorts, and joins. Use compound indexes where appropriate.\n\n## Conclusion\n\nGood schema design in MongoDB starts with understanding your access patterns.`,
    category: 'Development', tags: ['mongodb', 'database', 'nosql'], featured: false,
  },
  {
    title: 'The 10 Productivity Habits of Elite Developers',
    excerpt: 'The best developers don\'t work harder — they work smarter. Here are the habits that separate great engineers from the rest.',
    content: `## 1. Time Blocking\n\nDedicate uninterrupted 90-minute blocks to deep work. No Slack, no email.\n\n## 2. The Two-Minute Rule\n\nIf a task takes less than two minutes, do it now.\n\n## 3. Keyboard Shortcuts\n\nMaster your editor shortcuts. Every second saved compounds over time.\n\n## 4. Document As You Go\n\nWriting documentation after the fact is a myth. Add it while the context is fresh.\n\n## 5. Code Reviews as Learning\n\nApproach every code review as a learning opportunity, not a judgment.\n\n## Conclusion\n\nSmall habits practiced consistently create dramatic results over time.`,
    category: 'Productivity', tags: ['productivity', 'habits', 'developer'], featured: true,
  },
  {
    title: 'Tailwind CSS vs. CSS-in-JS: Which Should You Choose?',
    excerpt: 'Both approaches have passionate supporters. Here\'s an honest breakdown to help you make the right call for your project.',
    content: `## Tailwind CSS\n\n**Pros:**\n- Fast to write\n- Consistent design system\n- Great for teams\n- Tiny production bundle\n\n**Cons:**\n- Class noise in HTML\n- Learning curve for utility-first thinking\n\n## CSS-in-JS (e.g., Styled Components)\n\n**Pros:**\n- Co-located styles\n- Dynamic styling with props\n- Full CSS power\n\n**Cons:**\n- Runtime overhead\n- Bundle size\n\n## The Verdict\n\nFor most modern projects with a design system, Tailwind wins. For highly dynamic, component-driven styling, CSS-in-JS has advantages.\n\n## Conclusion\n\nThere's no universal answer. Choose based on your team's strengths and project requirements.`,
    category: 'Design', tags: ['css', 'tailwind', 'styling', 'frontend'], featured: false,
  },
  {
    title: 'AWS EC2 Deployment for Node.js — The Simple Way',
    excerpt: 'You don\'t need Kubernetes or Docker to deploy a Node.js app. Here\'s the straightforward EC2 approach.',
    content: `## Launch an EC2 Instance\n\nChoose Ubuntu 22.04 LTS, t2.micro for free tier. Open ports 22 (SSH) and your app port (e.g., 5000) in the security group.\n\n## Install Node.js\n\n\`\`\`bash\ncurl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt install -y nodejs\n\`\`\`\n\n## Clone and Run\n\n\`\`\`bash\ngit clone <your-repo>\ncd your-app\nnpm install\nnpm start\n\`\`\`\n\n## Keep It Running with Screen\n\n\`\`\`bash\nscreen -S myapp\nnode server.js\n# Ctrl+A then D to detach\n\`\`\`\n\n## Conclusion\n\nSimple, effective, and free tier eligible. Perfect for demos and small projects.`,
    category: 'Technology', tags: ['aws', 'ec2', 'deployment', 'nodejs'], featured: false,
  },
  {
    title: 'How to Build a Career in Tech Without a CS Degree',
    excerpt: 'Thousands of successful engineers never went to a traditional CS program. Here\'s the roadmap that actually works.',
    content: `## The Portfolio Beats the Diploma\n\nHiring managers look at GitHub profiles, not just resumes. Build projects that solve real problems.\n\n## Self-Learning Resources\n\n- freeCodeCamp for web development\n- The Odin Project for full-stack\n- LeetCode for algorithms\n- YouTube channels like Fireship\n\n## Networking\n\nAttend meetups, contribute to open source, and be active on Twitter/X and LinkedIn.\n\n## Your First Job\n\nDon't wait until you feel ready. Apply when you can build a full-stack app from scratch.\n\n## Conclusion\n\nThe tech industry rewards skills, not credentials. Start building today.`,
    category: 'Career', tags: ['career', 'self-taught', 'tech'], featured: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    if (RESET) {
      await Promise.all([
        User.deleteMany({}),
        Category.deleteMany({}),
        Post.deleteMany({}),
        Comment.deleteMany({}),
      ]);
      console.log('🗑  Cleared all collections');
    }

    // Create admin user
    let admin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@blog.com' });
    if (!admin) {
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10);
      admin = await User.create({
        name: process.env.ADMIN_NAME || 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@blog.com',
        passwordHash,
        role: 'admin',
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
      });
      console.log(`👤 Admin created: ${admin.email}`);
    } else {
      console.log(`👤 Admin already exists: ${admin.email}`);
    }

    // Create categories
    const createdCats = {};
    for (const cat of categories) {
      const slug = slugify(cat.name, { lower: true, strict: true });
      let c = await Category.findOne({ slug });
      if (!c) c = await Category.create({ name: cat.name, slug, description: cat.description });
      createdCats[cat.name] = c;
    }
    console.log(`📂 ${Object.keys(createdCats).length} categories ready`);

    // Create posts
    let postCount = 0;
    for (const p of postData) {
      const slug = slugify(p.title, { lower: true, strict: true });
      const exists = await Post.findOne({ slug });
      if (!exists) {
        await Post.create({
          title: p.title,
          slug,
          excerpt: p.excerpt,
          content: p.content,
          coverImageUrl: `https://picsum.photos/seed/${slug}/800/450`,
          authorId: admin._id,
          categoryId: createdCats[p.category]?._id || null,
          tags: p.tags,
          status: 'published',
          featured: p.featured,
          publishedAt: new Date(),
        });
        postCount++;
      }
    }
    console.log(`📝 ${postCount} posts seeded`);

    // Seed some comments
    const posts = await Post.find().limit(3);
    const sampleComments = [
      { guestName: 'Alice Johnson', message: 'Great article! Really well explained.' },
      { guestName: 'Bob Smith', message: 'I learned a lot from this. Thanks for sharing!' },
      { guestName: 'Carol White', message: 'Looking forward to more posts like this.' },
    ];
    let commentCount = 0;
    for (const post of posts) {
      const existing = await Comment.findOne({ postId: post._id });
      if (!existing) {
        for (const c of sampleComments) {
          await Comment.create({ postId: post._id, ...c });
          commentCount++;
        }
      }
    }
    console.log(`💬 ${commentCount} comments seeded`);

    console.log('\n✅ Seed complete!');
    console.log(`\n🔑 Admin Login:\n   Email: ${admin.email}\n   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
