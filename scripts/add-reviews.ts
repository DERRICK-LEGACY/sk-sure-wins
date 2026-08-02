import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const reviews = [
    { name: "Kato E.", content: "I was skeptical at first, but after the first week of using the Bronze package I made back my subscription money and more. Good tips overall, some games lost but the profits are real.", rating: 4 },
    { name: "Daniel Ssemwogerere", content: "Honestly the best tipster in Uganda right now. The odds are not ridiculously high, they are realistic. 2 odds every day adds up very fast. I highly recommend.", rating: 5 },
    { name: "Ivan M.", content: "Been a member for 3 months now. Some days are bad, but the winning days cover all the losses. Just follow their staking plan.", rating: 4 },
    { name: "Mugisha J.", content: "Bro these guys are legit. I paid for VIP and within 3 days we had a massive win on a 15 odd slip. Will definitely renew when my sub expires.", rating: 5 },
    { name: "Sarah N.", content: "I don't know much about football but I just stake exactly what they send. I withdrew 300k last weekend. Thank you SK Sure Wins!", rating: 5 },
    { name: "Peter Ochieng", content: "Good service. Sometimes the slips come a bit late before the games start, but the win rate is actually very decent compared to others I've tried.", rating: 4 },
    { name: "Ronald L.", content: "Munakapapula indeed! We are winning. If you are tired of losing your hard earned money to betting companies, just join this VIP.", rating: 5 },
    { name: "Brian K.", content: "Not 100% accurate (nobody is), but they are around 85% accurate which is very profitable in the long run. Good job admin.", rating: 4 }
  ];

  for (const r of reviews) {
    await prisma.testimonial.create({
      data: {
        name: r.name,
        content: r.content,
        rating: r.rating,
        approved: true
      }
    });
  }

  console.log("Added 8 natural reviews.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
