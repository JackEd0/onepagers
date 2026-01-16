import { db, Collection, Prompt, Tag } from './db';
import { v4 as uuidv4 } from 'uuid';

// Sample Tags
const sampleTags: Tag[] = [
  { id: uuidv4(), name: 'coding', color: '#007AFF' },
  { id: uuidv4(), name: 'writing', color: '#34C759' },
  { id: uuidv4(), name: 'creative', color: '#FF9500' },
  { id: uuidv4(), name: 'business', color: '#5856D6' },
  { id: uuidv4(), name: 'analysis', color: '#FF2D55' },
  { id: uuidv4(), name: 'learning', color: '#00C7BE' },
];

// Sample Collections
const sampleCollections: Omit<Collection, 'id'>[] = [
  { name: 'Code Assistant', emoji: '💻', order: 0, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Writing Help', emoji: '✍️', order: 1, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Creative Ideas', emoji: '🎨', order: 2, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Business', emoji: '💼', order: 3, createdAt: new Date(), updatedAt: new Date() },
];

// Sample Prompts
const samplePrompts: { collectionIndex: number; prompt: Omit<Prompt, 'id' | 'collectionId' | 'createdAt' | 'updatedAt'> }[] = [
  // Code Assistant prompts
  {
    collectionIndex: 0,
    prompt: {
      title: 'Code Review',
      template: `Please review the following {{language}} code and provide feedback on:
1. Code quality and best practices
2. Potential bugs or issues
3. Performance improvements
4. Security concerns

Code to review:
\`\`\`{{language}}
{{code}}
\`\`\``,
      description: 'Get a comprehensive code review with suggestions',
      tags: ['coding', 'analysis'],
      isFavorite: true,
      copyCount: 12,
      lastCopiedAt: new Date(Date.now() - 86400000),
    },
  },
  {
    collectionIndex: 0,
    prompt: {
      title: 'Explain Code',
      template: `Explain what this {{language}} code does in simple terms:

\`\`\`{{language}}
{{code}}
\`\`\`

Please include:
- What the code accomplishes
- How it works step by step
- Any important concepts used`,
      description: 'Get a clear explanation of any code snippet',
      tags: ['coding', 'learning'],
      isFavorite: false,
      copyCount: 8,
      lastCopiedAt: new Date(Date.now() - 172800000),
    },
  },
  {
    collectionIndex: 0,
    prompt: {
      title: 'Write Unit Tests',
      template: `Write comprehensive unit tests for the following {{language}} code using {{testFramework}}:

\`\`\`{{language}}
{{code}}
\`\`\`

Include tests for:
- Normal/expected inputs
- Edge cases
- Error handling`,
      description: 'Generate unit tests for your code',
      tags: ['coding'],
      isFavorite: true,
      copyCount: 5,
      lastCopiedAt: null,
    },
  },
  // Writing Help prompts
  {
    collectionIndex: 1,
    prompt: {
      title: 'Blog Post Outline',
      template: `Create a detailed outline for a blog post about "{{topic}}".

Target audience: {{audience}}
Desired length: {{wordCount}} words
Tone: {{tone}}

Include:
- Catchy title options
- Introduction hook
- Main sections with key points
- Conclusion with call-to-action`,
      description: 'Generate a structured blog post outline',
      tags: ['writing', 'creative'],
      isFavorite: true,
      copyCount: 15,
      lastCopiedAt: new Date(Date.now() - 3600000),
    },
  },
  {
    collectionIndex: 1,
    prompt: {
      title: 'Email Composer',
      template: `Write a professional email with the following details:

Purpose: {{purpose}}
Recipient: {{recipient}}
Key points to include: {{keyPoints}}
Tone: {{tone}}

Make it concise and clear.`,
      description: 'Compose professional emails quickly',
      tags: ['writing', 'business'],
      isFavorite: false,
      copyCount: 20,
      lastCopiedAt: new Date(Date.now() - 7200000),
    },
  },
  {
    collectionIndex: 1,
    prompt: {
      title: 'Proofread & Edit',
      template: `Please proofread and edit the following text for:
- Grammar and spelling errors
- Clarity and readability
- Tone consistency
- Flow and structure

Text to edit:
"""
{{text}}
"""

Provide the corrected version and list the changes made.`,
      description: 'Get your text proofread and improved',
      tags: ['writing'],
      isFavorite: false,
      copyCount: 7,
      lastCopiedAt: null,
    },
  },
  // Creative Ideas prompts
  {
    collectionIndex: 2,
    prompt: {
      title: 'Story Starter',
      template: `Generate a creative story opening based on:

Genre: {{genre}}
Setting: {{setting}}
Main character: {{character}}
Mood: {{mood}}

Write 2-3 paragraphs that hook the reader and establish the scene.`,
      description: 'Get creative story beginnings',
      tags: ['creative', 'writing'],
      isFavorite: true,
      copyCount: 3,
      lastCopiedAt: new Date(Date.now() - 259200000),
    },
  },
  {
    collectionIndex: 2,
    prompt: {
      title: 'Brainstorm Ideas',
      template: `Generate 10 creative ideas for: {{topic}}

Context: {{context}}
Constraints: {{constraints}}

For each idea, provide:
- Brief description
- Why it could work
- Potential challenges`,
      description: 'Brainstorm creative solutions and ideas',
      tags: ['creative', 'analysis'],
      isFavorite: false,
      copyCount: 11,
      lastCopiedAt: new Date(Date.now() - 43200000),
    },
  },
  // Business prompts
  {
    collectionIndex: 3,
    prompt: {
      title: 'Meeting Summary',
      template: `Summarize the following meeting notes into a clear, actionable format:

Meeting Notes:
"""
{{notes}}
"""

Include:
- Key decisions made
- Action items with owners
- Next steps and deadlines
- Open questions`,
      description: 'Turn messy notes into clear summaries',
      tags: ['business'],
      isFavorite: true,
      copyCount: 25,
      lastCopiedAt: new Date(Date.now() - 1800000),
    },
  },
  {
    collectionIndex: 3,
    prompt: {
      title: 'SWOT Analysis',
      template: `Perform a SWOT analysis for: {{subject}}

Context: {{context}}
Industry: {{industry}}

Provide a detailed analysis of:
- Strengths (internal positives)
- Weaknesses (internal negatives)
- Opportunities (external positives)
- Threats (external negatives)

Include recommendations based on the analysis.`,
      description: 'Generate comprehensive SWOT analysis',
      tags: ['business', 'analysis'],
      isFavorite: false,
      copyCount: 6,
      lastCopiedAt: null,
    },
  },
  // Uncategorized prompts
  {
    collectionIndex: -1, // No collection
    prompt: {
      title: 'Explain Like I\'m 5',
      template: `Explain "{{topic}}" in simple terms that a 5-year-old could understand. Use analogies and examples from everyday life.`,
      description: 'Simplify complex topics',
      tags: ['learning'],
      isFavorite: true,
      copyCount: 30,
      lastCopiedAt: new Date(Date.now() - 600000),
    },
  },
  {
    collectionIndex: -1,
    prompt: {
      title: 'Quick Translation',
      template: `Translate the following text from {{sourceLanguage}} to {{targetLanguage}}:

"""
{{text}}
"""

Maintain the original tone and meaning.`,
      description: 'Quick language translation',
      tags: ['writing'],
      isFavorite: false,
      copyCount: 18,
      lastCopiedAt: new Date(Date.now() - 14400000),
    },
  },
];

export async function seedSampleData(): Promise<{ collections: number; prompts: number; tags: number }> {
  // Check if data already exists
  const existingPrompts = await db.prompts.count();
  if (existingPrompts > 0) {
    console.log('Sample data already exists, skipping seed');
    return { collections: 0, prompts: 0, tags: 0 };
  }

  // Add tags
  await db.tags.bulkAdd(sampleTags);

  // Add collections and store their IDs
  const collectionIds: string[] = [];
  for (const collection of sampleCollections) {
    const id = uuidv4();
    await db.collections.add({ ...collection, id });
    collectionIds.push(id);
  }

  // Add prompts
  for (const { collectionIndex, prompt } of samplePrompts) {
    const id = uuidv4();
    const collectionId = collectionIndex >= 0 ? collectionIds[collectionIndex] : null;
    await db.prompts.add({
      ...prompt,
      id,
      collectionId,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
      updatedAt: new Date(),
    });
  }

  return {
    collections: sampleCollections.length,
    prompts: samplePrompts.length,
    tags: sampleTags.length,
  };
}

export async function hasSampleData(): Promise<boolean> {
  const count = await db.prompts.count();
  return count > 0;
}
