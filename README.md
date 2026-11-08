# Pema Wangda | Personal Portfolio

Built with HTML, CSS and JavaScript. Pages: index, about, skills, projects, education, contact.
Files: css/style.css, js/main.js (theme, menu, filters, form), js/customize.js (scenes, photo sticker, panel).

## Design meaning
- Logo: a lotus (Pema means lotus) with the </> of code in its centre petal. It is also the favicon.
- Colours: lotus pink is the brand colour. Each section has its own: About saffron, Skills water teal,
  Projects leaf green, Education indigo, Contact sky blue. Light and dark themes both use them.
- Icons: every nav item, card, project, fact and contact row has an icon. Skills use technology colours
  (HTML orange, CSS blue, JavaScript yellow, React cyan, Git red, Figma purple).
- Extras for launch: 404.html, robots.txt, .nojekyll (GitHub Pages), theme-color and share (Open Graph) tags,
  print styles, and skill bars that still show without JavaScript.

## Assignment checklist
- Home: name, photo, intro, headline ............ index.html
- About Me: bio, interests, education, goals .... about.html
- Skills: technical + soft skills ............... skills.html
- Projects: 3 projects, tech, links ............. projects.html
- Education: qualifications, certificates ....... education.html
- Contact: details + contact form ............... contact.html
- Responsive (desktop, tablet, mobile) .......... css/style.css
- Interactive: theme toggle, mobile menu, typing text, project filter,
  animated skill bars, form validation, background scenes, movable sticker

## Before you deploy
1. Replace placeholders: yourusername, pema@example.com, Your University, Your City.
2. Edit the 3 sample projects in projects.html (real titles, descriptions, GitHub + live links).
3. Add assets/pema.jpg (your photo) and optionally assets/background.mp4 (under ~10 MB).
   Uploads made in the Customize panel only live in your own browser.

## Deploy option A: GitHub Pages
    git init
    git add .
    git commit -m "Portfolio"
    git branch -M main
    git remote add origin https://github.com/yourusername/portfolio.git
    git push -u origin main
Then on GitHub: Settings > Pages > Deploy from a branch > main / (root) > Save.
Your site appears at https://yourusername.github.io/portfolio/ after a minute or two.

## Deploy option B: Vercel
Push the repo to GitHub, go to vercel.com/new, import it, and click Deploy (no build settings needed).

## Submit
Fill in submission.txt with your GitHub repository link and deployed website link, then upload it.
