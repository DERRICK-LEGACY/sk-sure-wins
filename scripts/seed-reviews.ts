import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const reviews = [
    { name: "John M.", content: "SK Sure Wins has been incredibly consistent. I doubled my bankroll in just a week following their VIP picks. Highly recommended!", rating: 5, approved: true },
    { name: "David O.", content: "Good service overall. The odds are realistic and the hit rate is solid. Sometimes the games are tight but it's profitable in the long run.", rating: 4, approved: true },
    { name: "Samuel T.", content: "I was skeptical at first, but this platform really delivers. The daily premium picks are well-researched.", rating: 5, approved: true },
    { name: "Michael K.", content: "Decent tips. Won 3 out of 4 slips this week. Much better than the other groups I've tried.", rating: 4, approved: true },
    { name: "Emmanuel S.", content: "The best subscription I've ever made. The transparency and real results make SK Sure Wins stand out.", rating: 5, approved: true },
    { name: "Chidi A.", content: "I appreciate the honesty when a game doesn't go our way, but the wins definitely cover the losses and then some.", rating: 5, approved: true },
    { name: "Oluwaseun B.", content: "Not bad, I started with the bronze package and I've seen good returns. Planning to upgrade to Premium soon.", rating: 4, approved: true },
    { name: "Isaac F.", content: "Top tier service! They don't promise fake fixed matches, just well-analyzed predictions that actually win.", rating: 5, approved: true },
  ];

  for (const review of reviews) {
    await prisma.testimonial.create({ data: review });
  }
  console.log("8 Reviews seeded successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
