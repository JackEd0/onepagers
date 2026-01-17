import { Collection, Prompt, Tag } from './db';
import { v4 as uuidv4 } from 'uuid';

// Generate stable IDs
const tagIds = {
  coding: uuidv4(),
  writing: uuidv4(),
  creative: uuidv4(),
  business: uuidv4(),
  analysis: uuidv4(),
  learning: uuidv4(),
};

const collIds = {
  codeAssistant: uuidv4(),
  writingHelp: uuidv4(),
  creativeIdeas: uuidv4(),
  business: uuidv4(),
};

// Exported Sample Tags
export const sampleTags: Tag[] = [
  { id: tagIds.coding, name: 'coding', color: '#007AFF' },
  { id: tagIds.writing, name: 'writing', color: '#34C759' },
  { id: tagIds.creative, name: 'creative', color: '#FF9500' },
  { id: tagIds.business, name: 'business', color: '#5856D6' },
  { id: tagIds.analysis, name: 'analysis', color: '#FF2D55' },
  { id: tagIds.learning, name: 'learning', color: '#00C7BE' },
];

// Exported Sample Collections
export const sampleCollections: Collection[] = [
  { id: collIds.codeAssistant, name: 'Code Assistant', emoji: '💻', order: 0, createdAt: new Date(), updatedAt: new Date() },
  { id: collIds.writingHelp, name: 'Writing Help', emoji: '✍️', order: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: collIds.creativeIdeas, name: 'Creative Ideas', emoji: '🎨', order: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: collIds.business, name: 'Business', emoji: '💼', order: 3, createdAt: new Date(), updatedAt: new Date() },
];

// Exported Sample Prompts
export const samplePrompts: Prompt[] = [
  // Code Assistant prompts
  {
    id: uuidv4(),
    collectionId: collIds.codeAssistant,
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
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    collectionId: collIds.codeAssistant,
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
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    collectionId: collIds.codeAssistant,
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
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  // Writing Help prompts
  {
    id: uuidv4(),
    collectionId: collIds.writingHelp,
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
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    collectionId: collIds.writingHelp,
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
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    collectionId: collIds.writingHelp,
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
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  // Creative Ideas prompts
  {
    id: uuidv4(),
    collectionId: collIds.creativeIdeas,
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
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    collectionId: collIds.creativeIdeas,
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
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  // Business prompts
  {
    id: uuidv4(),
    collectionId: collIds.business,
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
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    collectionId: collIds.business,
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
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  // Uncategorized prompts
  {
    id: uuidv4(),
    collectionId: null,
    title: "Explain Like I'm 5",
    template: `Explain "{{topic}}" in simple terms that a 5-year-old could understand. Use analogies and examples from everyday life.`,
    description: 'Simplify complex topics',
    tags: ['learning'],
    isFavorite: true,
    copyCount: 30,
    lastCopiedAt: new Date(Date.now() - 600000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    collectionId: null,
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
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
];
