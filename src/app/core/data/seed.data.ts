export interface SeedBookRequest {
  title: string;
  authorName: string;
  isbn: string;
  synopsis: string;
  shareable: boolean;
  archived: boolean;
}

export const SEED_BOOKS: SeedBookRequest[] = [...generateSeedBooks()];

function generateSeedBooks(): SeedBookRequest[] {
  return [
    {
      title: 'The Great Gatsby',
      authorName: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      synopsis:
        'A story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, set in the Jazz Age on Long Island.',
      shareable: true,
      archived: false,
    },
    {
      title: 'To Kill a Mockingbird',
      authorName: 'Harper Lee',
      isbn: '978-0-06-112008-4',
      synopsis:
        'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
      shareable: true,
      archived: false,
    },
    {
      title: '1984',
      authorName: 'George Orwell',
      isbn: '978-0-452-28423-4',
      synopsis: 'A dystopian novel set in a totalitarian society ruled by Big Brother.',
      shareable: true,
      archived: false,
    },
    {
      title: 'Pride and Prejudice',
      authorName: 'Jane Austen',
      isbn: '978-0-14-143951-8',
      synopsis:
        'A romantic novel of manners that follows the character development of Elizabeth Bennet.',
      shareable: false,
      archived: true,
    },
    {
      title: 'The Catcher in the Rye',
      authorName: 'J.D. Salinger',
      isbn: '978-0-316-76948-0',
      synopsis:
        "The story of Holden Caulfield's experiences in New York City after being expelled from prep school.",
      shareable: true,
      archived: false,
    },
    {
      title: 'The Hobbit',
      authorName: 'J.R.R. Tolkien',
      isbn: '978-0-547-92822-7',
      synopsis:
        'Bilbo Baggins is swept into a quest to reclaim the lost Dwarf Kingdom of Erebor from the fearsome dragon Smaug.',
      shareable: true,
      archived: false,
    },
    {
      title: 'Fahrenheit 451',
      authorName: 'Ray Bradbury',
      isbn: '978-1-4516-7331-9',
      synopsis:
        'A future American society where books are outlawed and firemen burn any that are found.',
      shareable: true,
      archived: false,
    },
    {
      title: 'Jane Eyre',
      authorName: 'Charlotte Brontë',
      isbn: '978-0-14-144114-6',
      synopsis:
        'Orphaned Jane Eyre endures a difficult childhood before becoming governess at Thornfield Hall.',
      shareable: false,
      archived: true,
    },
    {
      title: 'Brave New World',
      authorName: 'Aldous Huxley',
      isbn: '978-0-06-085052-4',
      synopsis:
        'A dystopian vision of a society where humans are genetically modified and socially conditioned.',
      shareable: true,
      archived: false,
    },
    {
      title: 'The Lord of the Rings',
      authorName: 'J.R.R. Tolkien',
      isbn: '978-0-618-64015-7',
      synopsis:
        'The epic fantasy saga of the War of the Ring and the quest to destroy the One Ring.',
      shareable: true,
      archived: false,
    },
    {
      title: 'Animal Farm',
      authorName: 'George Orwell',
      isbn: '978-0-452-28424-1',
      synopsis:
        'A satirical allegorical novella reflecting events leading up to the Russian Revolution.',
      shareable: true,
      archived: false,
    },
    {
      title: 'The Alchemist',
      authorName: 'Paulo Coelho',
      isbn: '978-0-06-231500-7',
      synopsis:
        'A young Andalusian shepherd follows his dream to find treasure at the Egyptian pyramids.',
      shareable: false,
      archived: true,
    },
    {
      title: 'Dune',
      authorName: 'Frank Herbert',
      isbn: '978-0-441-17271-9',
      synopsis:
        'Set on the desert planet Arrakis, the story explores politics, religion, and ecology.',
      shareable: true,
      archived: false,
    },
    {
      title: 'The Picture of Dorian Gray',
      authorName: 'Oscar Wilde',
      isbn: '978-0-14-143957-0',
      synopsis: 'A Gothic novel about a handsome young man who sells his soul for eternal youth.',
      shareable: true,
      archived: false,
    },
    {
      title: 'Wuthering Heights',
      authorName: 'Emily Brontë',
      isbn: '978-0-14-143955-6',
      synopsis: 'A tale of all-consuming passion and revenge set against the Yorkshire moors.',
      shareable: true,
      archived: false,
    },
    {
      title: 'The Road',
      authorName: 'Cormac McCarthy',
      isbn: '978-0-307-38789-5',
      synopsis: 'A father and his young son journey across a post-apocalyptic America.',
      shareable: false,
      archived: true,
    },
    {
      title: 'American Gods',
      authorName: 'Neil Gaiman',
      isbn: '978-0-06-257211-0',
      synopsis: 'A war is brewing between old and new gods in America.',
      shareable: true,
      archived: false,
    },
    {
      title: 'Neuromancer',
      authorName: 'William Gibson',
      isbn: '978-0-441-56959-5',
      synopsis:
        'A washed-up computer hacker is hired for one last job in the matrix of cyberspace.',
      shareable: true,
      archived: false,
    },
    {
      title: "The Handmaid's Tale",
      authorName: 'Margaret Atwood',
      isbn: '978-0-385-49081-8',
      synopsis:
        'A dystopian novel set in a totalitarian society where women are forced into servitude.',
      shareable: true,
      archived: false,
    },
    {
      title: 'Cloud Atlas',
      authorName: 'David Mitchell',
      isbn: '978-0-375-50725-0',
      synopsis:
        'Six interlinked stories spanning centuries, from the South Pacific to a post-apocalyptic future.',
      shareable: true,
      archived: false,
    },
    {
      title: 'The Name of the Wind',
      authorName: 'Patrick Rothfuss',
      isbn: '978-0-7564-0474-1',
      synopsis:
        'The tale of Kvothe, a legendary figure who recounts his journey from orphan to wizard.',
      shareable: true,
      archived: false,
    },
    {
      title: 'The Priory of the Orange Tree',
      authorName: 'Samantha Shannon',
      isbn: '978-1-9821-0507-1',
      synopsis:
        "A world-spanning fantasy epic about dragonriders, forbidden magic, and a queen's destiny.",
      shareable: true,
      archived: false,
    },
    {
      title: 'Piranesi',
      authorName: 'Susanna Clarke',
      isbn: '978-1-63557-563-7',
      synopsis:
        'A man lives alone in a strange house of endless halls and statues, documenting his existence.',
      shareable: false,
      archived: true,
    },
    {
      title: 'Project Hail Mary',
      authorName: 'Andy Weir',
      isbn: '978-0-593-21935-0',
      synopsis: 'An astronaut wakes up alone on a spacecraft with no memory of how he got there.',
      shareable: true,
      archived: false,
    },
  ];
}
