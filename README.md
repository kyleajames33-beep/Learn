# 🧬 Science Learning Hub

**Interactive science lessons for NSW students, Years 7-12**

A comprehensive, static HTML learning platform designed for Australian science students. Created by Kyle, a science teacher in Sydney, NSW.

---

## 📚 What is Science Hub?

Science Hub is a free, open-source learning platform that provides:

- **Interactive science lessons** aligned with the NSW syllabus
- **Progress tracking** using browser local storage
- **Mobile-friendly design** that works on any device
- **Self-contained lessons** - no backend, no login required
- **Offline-capable** once loaded

Perfect for students who want to:
- Review class material at their own pace
- Prepare for exams with structured lessons
- Access worked examples and practice problems
- Track their learning progress across modules

---

## 🎓 Available Content

### HSC Biology (Year 11 & 12)
8 comprehensive modules covering the complete HSC Biology syllabus:
- Module 1: Cells as the Basis of Life
- Module 2: Organisation of Living Things
- Module 3: Biological Diversity
- Module 4: Ecosystem Dynamics
- Module 5: Heredity
- Module 6: Genetic Change
- Module 7: Infectious Disease
- Module 8: Non-infectious Disease and Disorders

**Status:** Module 5 (Heredity) complete with 30 lessons. Other modules in development.

### Year 8 Science (Stage 4)
4 modules, one per term:
- Module 1: Matter (Elements, compounds, mixtures)
- Module 2: Energy (Forms, transfers, transformations)
- Module 3: Plate Tectonics and Rocks
- Module 4: Cells and Reproduction

**Status:** In development

### Year 9 Science (Stage 5)
4 modules, one per term:
- Module 1: Ecosystems
- Module 2: Atoms and the Periodic Table
- Module 3: Waves and Sound
- Module 4: Body Systems

**Status:** In development

### HSC Chemistry (Year 11 & 12)
**Status:** Planned for future development

---

## 🚀 Getting Started

### For Students

1. **Visit the site:** [https://kyleajames33-beep.github.io/science-hub](https://kyleajames33-beep.github.io/science-hub)
2. **Select your year level** from the homepage
3. **Choose a module** to begin learning
4. **Pick a lesson** and start studying
5. Your progress is **automatically saved** in your browser

#### Keyboard Shortcuts
- `Alt + →` - Next lesson
- `Alt + ←` - Previous lesson
- `Alt + H` - Module overview
- `/` - Focus search bar
- `Esc` - Close sidebar (mobile)

### For Teachers

This platform can be:
- **Shared with students** as supplementary material
- **Used in class** for guided instruction
- **Assigned as homework** with built-in progress tracking
- **Customized** by forking the repository and adding your own content

---

## 💻 Technical Details

### Tech Stack
- **Pure HTML/CSS/JavaScript** - no frameworks or libraries
- **Local storage** for progress tracking
- **GitHub Pages** for hosting
- **Responsive design** - mobile-first approach

### Browser Support
- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with ES6 support

### File Structure
```
science-hub/
├── index.html              # Homepage
├── assets/
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript modules
│   └── images/            # Icons and illustrations
├── hsc-biology/           # HSC Biology modules
├── year-8/                # Year 8 Science modules
├── year-9/                # Year 9 Science modules
├── CLAUDE.md              # Development guidelines
└── README.md              # This file
```

---

## 🎨 Design Philosophy

### Soft Ocean Breeze Color Palette
Carefully selected colors that are:
- **Easy on the eyes** for extended reading
- **WCAG AA compliant** for accessibility
- **Scientifically themed** (ocean blues, seafoam greens)
- **Distinct for different subjects** (biology = green, chemistry = orange, physics = purple)

### Mobile-First
Over 60% of students access learning materials on mobile devices. Every component is:
- Touch-friendly (44x44px minimum targets)
- Responsive (works on screens from 320px to 1920px)
- Performance-optimized (fast loading on slow connections)

### Accessibility
- Semantic HTML5 elements
- ARIA labels for interactive components
- Keyboard navigation support
- High contrast text
- Screen reader friendly

---

## 📖 How to Use This Repository

### For Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kyleajames33-beep/science-hub.git
   cd science-hub
   ```

2. **Open in your browser:**
   ```bash
   # Just open index.html in a browser
   # Or use a local server:
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Read the development guidelines:**
   - See [CLAUDE.md](CLAUDE.md) for comprehensive development guidelines
   - Follow the design system and component library
   - Maintain consistency across all lessons

### For Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-lesson`)
3. Follow the guidelines in [CLAUDE.md](CLAUDE.md)
4. Test on mobile and desktop
5. Submit a pull request

### Adding New Lessons

1. Copy the lesson template from the appropriate module
2. Update metadata (title, description, lesson number)
3. Replace content sections
4. Update navigation links (prev/next)
5. Test thoroughly before committing

---

## 🔒 Privacy & Data

### What We Store
- **Progress data** (completed lessons) - stored in your browser's local storage
- **Last visited lesson** - stored in your browser's local storage
- **Preferences** (sidebar state) - stored in your browser's local storage

### What We DON'T Store
- No user accounts or passwords
- No personal information
- No tracking or analytics (currently)
- No data sent to external servers

### Your Data
- **Stays on your device** - never leaves your browser
- **You control it** - clear browser data to reset progress
- **Export/import** - backup your progress as JSON (feature coming soon)

---

## 📝 License

This project is licensed under the **MIT License** - see below:

```
MIT License

Copyright (c) 2026 Kyle - Science Teacher, Sydney NSW

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **NSW Education Standards Authority (NESA)** for the excellent syllabus documents
- **Students** who provided feedback on lesson clarity and design
- **Fellow science teachers** who reviewed content accuracy
- **Open source community** for inspiration and best practices

---

## 📞 Contact & Support

### For Students
- **Questions about content?** Ask your teacher or check the lesson again
- **Found a mistake?** Report it via GitHub Issues
- **Need help?** Check the FAQ section (coming soon)

### For Teachers
- **Want to collaborate?** Open a GitHub issue to discuss
- **Have suggestions?** We'd love to hear them
- **Want to contribute lessons?** See the contributing guidelines

### Project Links
- **Live Site:** [https://kyleajames33-beep.github.io/science-hub](https://kyleajames33-beep.github.io/science-hub)
- **GitHub:** [https://github.com/kyleajames33-beep/science-hub](https://github.com/kyleajames33-beep/science-hub)
- **Issues:** [https://github.com/kyleajames33-beep/science-hub/issues](https://github.com/kyleajames33-beep/science-hub/issues)

---

## 🗺️ Roadmap

### Version 1.0 (Current) - MVP
- [x] Design system and component library
- [x] Homepage with year level selection
- [ ] HSC Biology Module 5 (30 lessons)
- [ ] Local storage implementation
- [ ] Search functionality
- [ ] Basic progress tracking

### Version 1.1 - Expansion
- [ ] Complete all 8 HSC Biology modules
- [ ] Year 8 Module 1 (25+ lessons)
- [ ] Year 9 Module 1 (25+ lessons)
- [ ] Enhanced search with filters
- [ ] Print-friendly lesson pages

### Version 2.0 - Enhancement
- [ ] HSC Chemistry content
- [ ] Dark mode toggle
- [ ] Progress export/import
- [ ] Lesson bookmarks
- [ ] Notes feature
- [ ] Practice quiz generator

### Future Considerations
- HSC Physics content
- Year 10 Science modules
- Teacher dashboard
- Assignment features
- PDF generation

---

## 📊 Project Status

**Current Version:** 1.0.0 (MVP)
**Last Updated:** February 4, 2026
**Status:** Active Development
**Completion:** ~15% (Foundation complete, content in progress)

---

**Made with ❤️ by Kyle for science students in Sydney and beyond.**

*Science Hub - Because science should be accessible to everyone.*
