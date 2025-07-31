---
applyTo: '**'
---

# 🧠 TejonTech AI Coding Standards

These guidelines govern all code generation. Follow them strictly unless project-specific context dictates otherwise.

## 🧩 Core Principles

1. **Preserve Context with Global Memory**  
   Remember user preferences, architectural patterns, and prior decisions to maintain consistency across sessions.

2. **Use Current, Reliable Information**  
   Base suggestions on up-to-date documentation, modern best practices, and the latest stable versions of languages, frameworks, and libraries.

3. **Write Clean, Well-Structured Code**

   - Organize code logically with clear separation of concerns.
   - Include concise, meaningful comments and documentation where needed.
   - Prioritize readability, maintainability, and long-term scalability.

4. **Ensure Safety and Correctness**  
   All code must be functionally correct, secure by default, and free from known vulnerabilities. Never suggest insecure or deprecated patterns.

5. **Use English Universally**  
   All identifiers (variables, functions, classes), comments, logs, and documentation must be in clear, grammatically correct English.

## 🔐 Security & Reliability

6. **Apply Security and Performance Best Practices**

   - Validate inputs, sanitize outputs, and prevent injection, XSS, CSRF, and other common threats.
   - Optimize critical operations for speed and memory usage without compromising clarity.

7. **Ensure Modern Compatibility**  
   Target current standards (e.g., ES2023+, HTML5, CSS3) and widely supported APIs. Prefer native features over polyfills when feasible.

8. **Implement Comprehensive Error Handling & Logging**

   - Use structured error handling (try/catch, promises, async/await).
   - Log errors meaningfully for debugging, avoiding sensitive data exposure.

9. **Support Version Control Workflows**  
   Assume Git is used. Suggest atomic commits, descriptive messages, and adherence to branching models (e.g., Git Flow or trunk-based development).

10. **Avoid Inline SVGs; Use `oh-vue-icons`**  
    Import icons via `oh-vue-icons` as already configured in `main.ts`. Do not generate or embed raw SVGs. Use icon components instead.

## 🛠️ Code Quality & Maintenance

11. **Use Secure and Updated Dependencies**  
    Recommend only actively maintained, high-quality packages with no known vulnerabilities. Avoid deprecated or abandoned libraries.

12. **Enforce Consistent Coding Style**

- Follow project style guides (e.g., ESLint, Prettier, Airbnb, or Standard).
- Use `camelCase` for variables/functions, `PascalCase` for components/classes, `kebab-case` for filenames.
- Keep formatting uniform and predictable.

13. **Follow Clean Code Principles**

- Write small, single-purpose functions.
- Avoid side effects and deeply nested logic.
- Keep code DRY, modular, and testable.

14. **Optimize for Performance and Readability**  
    Favor efficient algorithms and data structures, but never at the expense of clarity. Document performance-critical decisions.

15. **Prioritize Quality Over Speed**  
    Deliver accurate, robust, and well-tested solutions—even if they require more effort—over fast but fragile workarounds.

## 📌 General Notes

> 💡 This configuration applies globally (`applyTo: '**'`).  
> For project-specific exceptions, provide explicit overrides in context.  
> When in doubt, ask for clarification before generating code.
