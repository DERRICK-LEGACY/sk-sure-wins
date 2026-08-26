const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/components/HomePage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import
if (!content.includes('import BookSection')) {
  content = content.replace('import PaymentModal from "@/components/PaymentModal";', 'import PaymentModal from "@/components/PaymentModal";\nimport BookSection from "@/components/BookSection";');
}

// 2. Extract Stats Section
const statsStartStr = '      {/* STATS SECTION */}';
const meetExpertStr = '      {/* MEET THE EXPERT */}';
const statsStartIndex = content.indexOf(statsStartStr);
const meetExpertIndex = content.indexOf(meetExpertStr);

if (statsStartIndex !== -1 && meetExpertIndex !== -1) {
  const statsSection = content.substring(statsStartIndex, meetExpertIndex);
  
  // Remove stats section from current location
  content = content.replace(statsSection, '');
  
  // Insert stats section right after Hero Section ends (line 201)
  const heroEndStr = '        </section>\n\n        {/* SPECIAL OFFER BANNER (If Active) */}';
  content = content.replace(heroEndStr, '        </section>\n\n' + statsSection + '        {/* SPECIAL OFFER BANNER (If Active) */}');
}

// 3. Insert Book Section after Recent Tickets
const recentTicketsEndStr = '      </motion.section>\n';
// find the first occurrence of recentTicketsEndStr after recent tickets start
const recentTicketsStartStr = '{/* RECENT TICKETS (FREE & VIP WINS) */}';
const ticketsStartIndex = content.indexOf(recentTicketsStartStr);
if (ticketsStartIndex !== -1) {
    const nextEndIndex = content.indexOf(recentTicketsEndStr, ticketsStartIndex);
    if (nextEndIndex !== -1) {
        const insertionPoint = nextEndIndex + recentTicketsEndStr.length;
        const part1 = content.substring(0, insertionPoint);
        const part2 = content.substring(insertionPoint);
        content = part1 + '\n      {/* BOOK SECTION */}\n      <BookSection openModal={openModal} />\n' + part2;
    }
}


fs.writeFileSync(filePath, content);
console.log('HomePage refactored successfully.');
