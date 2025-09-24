import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface CodeAnalysisContext {
  title: string;
  description: string;
  author: string;
  baseBranch: string;
  headBranch: string;
}

interface CodeIssue {
  type: 'bug' | 'security' | 'performance' | 'style' | 'maintainability';
  description: string;
  line?: number;
  code?: string;
  severity: 'low' | 'medium' | 'high';
}

interface CodeAnalysis {
  summary: string;
  score: number;
  issues: CodeIssue[];
  suggestions: string[];
  positiveAspects: string[];
}

export async function analyzeCodeWithAI(
  diff: string,
  context: CodeAnalysisContext
): Promise<CodeAnalysis | null> {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('Groq API key not configured');
    }

    const prompt = createAnalysisPrompt(diff, context);
    
    // Try the requested model first, then fallback to working model
    const models = ['openai/gpt-oss-20b', 'llama-3.1-8b-instant'];
    let lastError: Error | null = null;
    
    for (const model of models) {
      try {
        const response = await groq.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'system',
              content: `You are an expert code reviewer. Analyze the provided code diff and provide a comprehensive review focusing on:
1. Potential bugs and security issues
2. Code quality and maintainability
3. Performance implications
4. Best practices adherence
5. Documentation and comments
6. Variable naming and code clarity

Provide constructive feedback that helps improve the code quality.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        });

        const analysisText = response.choices[0]?.message?.content;
        if (!analysisText) {
          throw new Error('No analysis received from Groq');
        }

        console.log(`Successfully used model: ${model}`);
        return parseAIResponse(analysisText);
        
      } catch (error) {
        console.log(`Model ${model} failed, trying next model...`);
        lastError = error as Error;
        continue;
      }
    }
    
    throw lastError || new Error('All models failed');

  } catch (error) {
    console.error('Error analyzing code with AI:', error);
    return null;
  }
}

function createAnalysisPrompt(diff: string, context: CodeAnalysisContext): string {
  return `
Please analyze the following code diff for a pull request:

**Pull Request Details:**
- Title: ${context.title}
- Description: ${context.description}
- Author: ${context.author}
- Base Branch: ${context.baseBranch}
- Head Branch: ${context.headBranch}

**Code Diff:**
\`\`\`diff
${diff}
\`\`\`

Please provide a comprehensive code review in the following JSON format:

{
  "summary": "Brief summary of the changes and overall assessment",
  "score": 8,
  "issues": [
    {
      "type": "bug|security|performance|style|maintainability",
      "description": "Description of the issue",
      "line": 42,
      "code": "example code snippet",
      "severity": "low|medium|high"
    }
  ],
  "suggestions": [
    "Specific improvement suggestions",
    "Best practices to follow"
  ],
  "positiveAspects": [
    "Good practices observed",
    "Well-implemented features"
  ]
}

Focus on:
1. **Bugs**: Logic errors, edge cases, potential runtime issues
2. **Security**: Vulnerabilities, unsafe practices, data exposure
3. **Performance**: Inefficient algorithms, memory leaks, unnecessary operations
4. **Style**: Code formatting, naming conventions, consistency
5. **Maintainability**: Code complexity, documentation, testability

Provide actionable feedback that helps improve code quality.
`;
}

function parseAIResponse(response: string): CodeAnalysis {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        summary: parsed.summary || 'Analysis completed',
        score: Math.max(1, Math.min(10, parsed.score || 5)),
        issues: parsed.issues || [],
        suggestions: parsed.suggestions || [],
        positiveAspects: parsed.positiveAspects || [],
      };
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
  }

  // Fallback parsing if JSON parsing fails
  return {
    summary: response.substring(0, 200) + '...',
    score: 5,
    issues: [],
    suggestions: ['Please review the code manually for potential improvements'],
    positiveAspects: ['Code changes detected'],
  };
}

// Alternative analysis function for specific code patterns
export async function analyzeSpecificPatterns(diff: string): Promise<string[]> {
  const patterns = [
    {
      name: 'Missing Comments',
      regex: /^\+.*function\s+\w+\(/gm,
      message: 'Consider adding JSDoc comments for functions'
    },
    {
      name: 'Console Logs',
      regex: /^\+.*console\.(log|warn|error)/gm,
      message: 'Remove console statements from production code'
    },
    {
      name: 'TODO Comments',
      regex: /^\+.*TODO|FIXME|HACK/gm,
      message: 'Address TODO/FIXME comments before merging'
    },
    {
      name: 'Hardcoded Values',
      regex: /^\+.*['"`]\d+['"`]|['"`]https?:\/\/['"`]/gm,
      message: 'Consider extracting hardcoded values to constants'
    }
  ];

  const findings: string[] = [];
  
  patterns.forEach(pattern => {
    const matches = diff.match(pattern.regex);
    if (matches) {
      findings.push(`${pattern.name}: ${pattern.message} (${matches.length} occurrences)`);
    }
  });

  return findings;
}
