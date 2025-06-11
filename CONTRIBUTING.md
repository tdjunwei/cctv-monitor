# Contributing to CCTV Monitor

Thank you for your interest in contributing to the CCTV Monitor application! This guide will help you get started.

## Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/cctv-monitor.git
   cd cctv-monitor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Code Style and Standards

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces in `src/types/cctv.ts`
- Avoid using `any` type
- Use proper type annotations for function parameters and return values

### React Components
- Use functional components with hooks
- Follow the existing component structure
- Use Shadcn/ui components for consistency
- Implement proper error boundaries where needed

### Forms
- Use `react-hook-form` with `zod` validation for all forms
- Create reusable form schemas in separate files
- Implement proper error handling and user feedback

### Styling
- Use Tailwind CSS utility classes
- Follow the existing design system
- Ensure responsive design (mobile-first approach)
- Use CSS variables for consistent theming

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/            # React components
│   ├── ui/               # Shadcn/ui base components
│   └── *.tsx            # Feature components
├── lib/                  # Utility functions
├── types/               # TypeScript type definitions
└── styles/              # Global styles
```

## Adding New Features

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Implement your feature**
   - Add components to appropriate directories
   - Update type definitions if needed
   - Add proper TypeScript types
   - Include error handling

3. **Test your changes**
   - Ensure the app builds: `npm run build`
   - Check for TypeScript errors: `npm run type-check`
   - Run linting: `npm run lint`
   - Test manually in the browser

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add camera deletion functionality
fix: resolve camera grid layout issue on mobile
docs: update installation instructions
style: improve button hover states
refactor: extract camera validation logic
```

## Component Guidelines

### Creating New Components

1. **Use TypeScript interfaces**
   ```typescript
   interface CameraCardProps {
     camera: Camera;
     onEdit: (camera: Camera) => void;
     onDelete: (id: string) => void;
   }
   ```

2. **Implement proper props validation**
   ```typescript
   export function CameraCard({ camera, onEdit, onDelete }: CameraCardProps) {
     // Component implementation
   }
   ```

3. **Use Shadcn/ui components**
   ```typescript
   import { Button } from "@/components/ui/button";
   import { Card, CardContent, CardHeader } from "@/components/ui/card";
   ```

### Form Components

1. **Use react-hook-form with zod**
   ```typescript
   const schema = z.object({
     name: z.string().min(1, "Name is required"),
     url: z.string().url("Invalid URL format"),
   });

   type FormData = z.infer<typeof schema>;
   ```

2. **Implement proper error handling**
   ```typescript
   const form = useForm<FormData>({
     resolver: zodResolver(schema),
   });
   ```

## Testing Guidelines

- Write unit tests for utility functions
- Test form validation logic
- Ensure components render without errors
- Test responsive design on different screen sizes

## Pull Request Process

1. **Ensure your PR addresses a single concern**
2. **Include a clear description of changes**
3. **Reference any related issues**
4. **Ensure all checks pass**
5. **Request review from maintainers**

## Code Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] Components use proper prop types
- [ ] Forms include validation
- [ ] Styling is consistent with design system
- [ ] Code is properly formatted
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] Mobile responsiveness is tested

## Getting Help

- Check existing issues and discussions
- Read the README.md for project overview
- Review the codebase for examples
- Ask questions in GitHub Discussions

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.
