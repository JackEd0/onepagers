-- SupaPrompts Sample Data
-- Run this after creating the schema to populate with test data

-- Insert Collections
INSERT INTO collections (name, sort_order) VALUES
  ('Writing', 1),
  ('Coding', 2),
  ('Marketing', 3);

-- Insert Sample Prompts

-- Writing Collection
INSERT INTO prompts (collection_id, title, template, description, tags, is_favorite, copied_count)
VALUES (
  (SELECT id FROM collections WHERE name = 'Writing'),
  'Blog Post Outline',
  'Create a detailed blog post outline about {{topic}}.

Target audience: {{audience}}
Desired length: {{word_count}} words
Tone: {{tone}}

Include:
- Catchy headline options (3)
- Introduction hook
- 5-7 main sections with subpoints
- Conclusion with CTA
- SEO keywords to target',
  'Generate structured blog post outlines with SEO focus',
  ARRAY['writing', 'blog', 'seo', 'content'],
  true,
  12
);

INSERT INTO prompts (collection_id, title, template, description, tags, is_favorite, copied_count)
VALUES (
  (SELECT id FROM collections WHERE name = 'Writing'),
  'Email Rewriter',
  'Rewrite the following email to be more {{tone}}.

Original email:
{{email_content}}

Requirements:
- Keep the core message intact
- Make it {{tone}}
- Ensure clarity and professionalism
- Keep it concise',
  'Transform emails to match different tones (professional, friendly, urgent)',
  ARRAY['writing', 'email', 'communication'],
  false,
  8
);

-- Coding Collection
INSERT INTO prompts (collection_id, title, template, description, tags, is_favorite, copied_count)
VALUES (
  (SELECT id FROM collections WHERE name = 'Coding'),
  'Code Review Assistant',
  'Review the following {{language}} code and provide feedback:

```{{language}}
{{code}}
```

Please analyze:
1. Code quality and readability
2. Potential bugs or edge cases
3. Performance improvements
4. Security considerations
5. Best practices adherence

Suggest improvements with code examples.',
  'Get comprehensive code reviews with actionable suggestions',
  ARRAY['coding', 'review', 'best-practices'],
  true,
  25
);

INSERT INTO prompts (collection_id, title, template, description, tags, is_favorite, copied_count)
VALUES (
  (SELECT id FROM collections WHERE name = 'Coding'),
  'Unit Test Generator',
  'Generate unit tests for the following {{language}} function:

```{{language}}
{{code}}
```

Testing framework: {{framework}}

Include tests for:
- Happy path scenarios
- Edge cases
- Error handling
- Boundary conditions

Follow {{framework}} best practices and conventions.',
  'Auto-generate comprehensive unit tests for any function',
  ARRAY['coding', 'testing', 'automation'],
  false,
  15
);

-- Marketing Collection
INSERT INTO prompts (collection_id, title, template, description, tags, is_favorite, copied_count)
VALUES (
  (SELECT id FROM collections WHERE name = 'Marketing'),
  'Social Media Post Creator',
  'Create a {{platform}} post for:

Product/Topic: {{product}}
Goal: {{goal}}
Target audience: {{audience}}

Requirements:
- Platform-appropriate length and format
- Include relevant hashtags
- Add a clear call-to-action
- Make it engaging and shareable

Provide 3 variations with different angles.',
  'Generate platform-optimized social media content',
  ARRAY['marketing', 'social-media', 'copywriting'],
  true,
  30
);

-- Verify the inserts
SELECT 'Collections:' as info, count(*) as count FROM collections
UNION ALL
SELECT 'Prompts:' as info, count(*) as count FROM prompts;
