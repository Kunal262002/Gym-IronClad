import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Trainer from '../models/Trainer.js';
import MembershipPlan from '../models/MembershipPlan.js';
import ClassSchedule from '../models/ClassSchedule.js';

dotenv.config();

/**
 * Seeds the database with sample trainers, membership plans, and classes.
 * Run with: npm run seed
 */
const seedData = async () => {
  await connectDB();

  await Trainer.deleteMany();
  await MembershipPlan.deleteMany();
  await ClassSchedule.deleteMany();

  const trainers = await Trainer.insertMany([
    {
      name: 'Marcus Reed',
      specialty: 'Strength & Powerlifting',
      bio: 'Marcus has spent over a decade coaching lifters from their first squat to competition platforms.',
      experienceYears: 11,
      photoUrl: '',
    },
    {
      name: 'Elena Vasquez',
      specialty: 'HIIT & Conditioning',
      bio: 'Elena builds high-intensity programs that keep members motivated and progressing week over week.',
      experienceYears: 7,
      photoUrl: '',
    },
    {
      name: 'Jordan Okafor',
      specialty: 'Mobility & Recovery',
      bio: 'Jordan focuses on movement quality, helping members train hard without breaking down.',
      experienceYears: 9,
      photoUrl: '',
    },
  ]);

  const plans = await MembershipPlan.insertMany([
    {
      name: 'Starter',
      price: 29,
      billingCycle: 'monthly',
      perks: ['Full gym floor access', 'Locker room access', 'Free fitness assessment'],
      isPopular: false,
    },
    {
      name: 'Performance',
      price: 59,
      billingCycle: 'monthly',
      perks: ['Everything in Starter', 'Unlimited group classes', '2 trainer check-ins / month'],
      isPopular: true,
    },
    {
      name: 'Elite',
      price: 99,
      billingCycle: 'monthly',
      perks: ['Everything in Performance', 'Weekly 1-on-1 coaching', 'Custom nutrition plan'],
      isPopular: false,
    },
  ]);

  await ClassSchedule.insertMany([
    {
      title: 'Power Hour',
      description: 'A strength-focused session covering the big compound lifts.',
      trainer: trainers[0]._id,
      dayOfWeek: 'Monday',
      startTime: '18:00',
      durationMinutes: 60,
      capacity: 15,
    },
    {
      title: 'HIIT Blast',
      description: 'High-intensity intervals designed to torch calories and build conditioning.',
      trainer: trainers[1]._id,
      dayOfWeek: 'Wednesday',
      startTime: '07:00',
      durationMinutes: 45,
      capacity: 20,
    },
    {
      title: 'Mobility Reset',
      description: 'Slow, deliberate movement work to improve range of motion and recovery.',
      trainer: trainers[2]._id,
      dayOfWeek: 'Friday',
      startTime: '19:00',
      durationMinutes: 50,
      capacity: 12,
    },
  ]);

  console.log('Seed data inserted successfully.');
  process.exit(0);
};

seedData().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
