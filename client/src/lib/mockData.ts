import img1 from '@assets/stock_images/portrait_of_diverse__a8661d39.jpg';
import img2 from '@assets/stock_images/portrait_of_diverse__601033e3.jpg';
import img3 from '@assets/stock_images/portrait_of_diverse__e19a7384.jpg';
import img4 from '@assets/stock_images/portrait_of_diverse__573eb580.jpg';
import img5 from '@assets/stock_images/portrait_of_diverse__c94725d2.jpg';
import img6 from '@assets/stock_images/portrait_of_diverse__5ed54b94.jpg';

export interface User {
  id: string;
  name: string;
  age: number;
  distance: string;
  image: string;
  bio: string;
  tags: string[];
  status: 'online' | 'offline' | 'busy';
  coordinates: { x: number; y: number }; // Percentage 0-100
}

export const CURRENT_USER = {
  id: 'me',
  name: 'Alex',
  age: 26,
  image: img1,
  bio: 'Just moved to the city. Looking for gym buddies and coffee dates.',
  tags: ['Gym', 'Coffee', 'Travel', 'Tech'],
  subscription: 'free'
};

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Jordan',
    age: 24,
    distance: '200m',
    image: img2,
    bio: 'Art director by day, gamer by night. 🎨🎮',
    tags: ['Art', 'Gaming', 'Nightlife'],
    status: 'online',
    coordinates: { x: 45, y: 45 }
  },
  {
    id: '2',
    name: 'Casey',
    age: 29,
    distance: '500m',
    image: img3,
    bio: 'Love hiking and outdoor adventures. Looking for someone to explore with.',
    tags: ['Hiking', 'Outdoors', 'Photography'],
    status: 'offline',
    coordinates: { x: 60, y: 30 }
  },
  {
    id: '3',
    name: 'Riley',
    age: 22,
    distance: '800m',
    image: img4,
    bio: 'Student at the university. 📚',
    tags: ['Student', 'Books', 'Coffee'],
    status: 'online',
    coordinates: { x: 20, y: 60 }
  },
  {
    id: '4',
    name: 'Taylor',
    age: 27,
    distance: '1.2km',
    image: img5,
    bio: 'Musician. Let\'s jam? 🎸',
    tags: ['Music', 'Guitar', 'Concerts'],
    status: 'busy',
    coordinates: { x: 80, y: 80 }
  },
  {
    id: '5',
    name: 'Morgan',
    age: 30,
    distance: '1.5km',
    image: img6,
    bio: 'Chef. I make the best pasta in town. 🍝',
    tags: ['Food', 'Cooking', 'Wine'],
    status: 'online',
    coordinates: { x: 30, y: 20 }
  },
   {
    id: '6',
    name: 'Jamie',
    age: 25,
    distance: '300m',
    image: img1, // Reusing img1 for variety in map
    bio: 'Just looking for friends.',
    tags: ['Friends', 'Chat'],
    status: 'online',
    coordinates: { x: 55, y: 65 }
  }
];
