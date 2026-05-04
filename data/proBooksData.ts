// Pro Kitaplar Verileri
// Akademik İngilizce okuma materyalleri

import { NEW_PRO_BOOKS } from './newProBooks';
import { COVER_STYLES } from '../components/BookCover';

export interface ProBook {
  id: number;
  title: string;
  author: string;
  cover: string;
  coverStyle?: any; // optional visual style for dynamic covers
  image?: string;
  level: 'A2' | 'B1' | 'B2' | 'C1';
  description: string;
  chapters: ProBookChapter[];
}

export interface ProBookChapter {
  id: number;
  title: string;
  content: string;
}

// Core classic set
const BASE_PRO_BOOKS: ProBook[] = [
  {
    id: 1,
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    cover: "📖",
    coverStyle: COVER_STYLES.royal,
    image: "https://images.unsplash.com/photo-1517771744216-9e6b66dd55e9?auto=format&fit=crop&q=80&w=600",
    level: "B1",
    description: "Follow Alice down the rabbit hole into a world of wonder and peculiar characters.",
    chapters: [
      {
        id: 1,
        title: "Chapter 1: Down the Rabbit-Hole",
        content: `Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, 'and what is the use of a book,' thought Alice 'without pictures or conversation?'

So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.

There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, 'Oh dear! Oh dear! I shall be late!' (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.

In another moment down went Alice after it, never once considering how in the world she was to get out again.

The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.`
      },
      {
        id: 2,
        title: "Chapter 2: The Pool of Tears",
        content: `'Curiouser and curiouser!' cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English); 'now I'm opening out like the largest telescope that ever was! Good-bye, feet!' (for when she looked down at her feet, they seemed to be almost out of sight, they were getting so far off). 'Oh, my poor little feet, I wonder who will put on your shoes and stockings for you now, dears? I'm sure I shan't be able! I shall be a great deal too far off to trouble myself about you: you must manage the best way you can;—but I must be kind to them,' thought Alice, 'or perhaps they won't walk the way I want to go! Let me see: I'll give them a new pair of boots every Christmas.'

Just then her head struck against the roof of the hall: in fact she was now more than nine feet high, and she at once took up the little golden key and hurried off to the garden door.

Poor Alice! It was as much as she could do, lying down on one side, to look through into the garden with one eye; but to get through was more hopeless than ever: she sat down and began to cry again.`
      },
      {
        id: 3,
        title: "Chapter 3: A Caucus-Race",
        content: `They were indeed a queer-looking party that assembled on the bank—the birds with draggled feathers, the animals with their fur clinging close to them, and all dripping wet, cross, and uncomfortable.

The first question of course was, how to get dry again: they had a consultation about this, and after a few minutes it seemed quite natural to Alice to find herself talking familiarly with them, as if she had known them all her life.

At last the Mouse, who seemed to be a person of authority among them, called out, 'Sit down, all of you, and listen to me! I'll soon make you dry enough!' They all sat down at once, in a large ring, with the Mouse in the middle.`
      }
    ]
  },
  {
    id: 3,
    title: "Moby Dick",
    author: "Herman Melville",
    cover: "🐋",
    coverStyle: COVER_STYLES.ocean,
    image: "https://images.unsplash.com/photo-1466027173167-270e5b018599?auto=format&fit=crop&q=80&w=600",
    level: "C1",
    description: "Kaptan Ahab'ın beyaz balina Moby Dick'e karşı intikam arayışının destansı hikayesi.",
    chapters: [
      {
        id: 1,
        title: "Etymology & Extracts",
        content: `Moby Dick; or The Whale | Project Gutenberg MOBY-DICK; or, THE WHALE. By Herman Melville`
      },
      {
        id: 2,
        title: "CHAPTER 1. Loomings. Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to sea as soon as I can.",
        content: `This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me. There now is your insular city of the Manhattoes, belted round by wharves as Indian isles by coral reefs—commerce surrounds it with her surf. Right and left, the streets take you waterward.

Its extreme downtown is the battery, where that noble mole is washed by waves, and cooled by breezes, which a few hours previous were out of sight of land. Look at the crowds of water-gazers there. Circumambulate the city of a dreamy Sabbath afternoon. Go from Corlears Hook to Coenties Slip, and from thence, by Whitehall, northward. What do you see?—Posted like silent sentinels all around the town, stand thousands upon thousands of mortal men fixed in ocean reveries. Some leaning against the spiles; some seated upon the pier-heads; some looking over the bulwarks of ships from China; some high aloft in the rigging, as if striving to get a still better seaward peep.

But these are all landsmen; of week days pent up in lath and plaster—tied to counters, nailed to benches, clinched to desks. How then is this? Are the green fields gone? What do they here? But look! here come more crowds, pacing straight for the water, and seemingly bound for a dive. Strange! Nothing will content them but the extremest limit of the land; loitering under the shady lee of yonder warehouses will not suffice. No. They must get just as nigh the water as they possibly can without falling in.

And there they stand—miles of them—leagues. Inlanders all, they come from lanes and alleys, streets and avenues—north, east, south, and west. Yet here they all unite. Tell me, does the magnetic virtue of the needles of the compasses of all those ships attract them thither? Once more. Say you are in the country; in some high land of lakes. Take almost any path you please, and ten to one it carries you down in a dale, and leaves you there by a pool in the stream. There is magic in it. Let the most absent-minded of men be plunged in his deepest reveries—stand that man on his legs, set his feet a-going, and he will infallibly lead you to water, if water there be in all that region.

Should you ever be athirst in the great American desert, try this experiment, if your caravan happen to be supplied with a metaphysical professor. Yes, as every one knows, meditation and water are wedded for ever. But here is an artist. He desires to paint you the dreamiest, shadiest, quietest, most enchanting bit of romantic landscape in all the valley of the Saco. What is the chief element he employs? There stand his trees, each with a hollow trunk, as if a hermit and a crucifix were within; and here sleeps his meadow, and there sleep his cattle; and up from yonder cottage goes a sleepy smoke.

Deep into distant woodlands winds a mazy way, reaching to overlapping spurs of mountains bathed in their hill-side blue. But though the picture lies thus tranced, and though this pine-tree shakes down its sighs like leaves upon this shepherd’s head, yet all were vain, unless the shepherd’s eye were fixed upon the magic stream before him. Go visit the Prairies in June, when for scores on scores of miles you wade knee-deep among Tiger-lilies—what is the one charm wanting?—Water—there is not a drop of water there!

Were Niagara but a cataract of sand, would you travel your thousand miles to see it? Why did the poor poet of Tennessee, upon suddenly receiving two handfuls of silver, deliberate whether to buy him a coat, which he sadly needed, or invest his money in a pedestrian trip to Rockaway Beach? Why is almost every robust healthy boy with a robust healthy soul in him, at some time or other crazy to go to sea? Why upon your first voyage as a passenger, did you yourself feel such a mystical vibration, when first told that you and your ship were now out of sight of land?

Why did the old Persians hold the sea holy? Why did the Greeks give it a separate deity, and own brother of Jove? Surely all this is not without meaning. And still deeper the meaning of that story of Narcissus, who because he could not grasp the tormenting, mild image he saw in the fountain, plunged into it and was drowned. But that same image, we ourselves see in all rivers and oceans. It is the image of the ungraspable phantom of life; and this is the key to it all. Now, when I say that I am in the habit of going to sea whenever I begin to grow hazy about the eyes, and begin to be over conscious of my lungs, I do not mean to have it inferred that I ever go to sea as a passenger.

For to go as a passenger you must needs have a purse, and a purse is but a rag unless you have something in it. Besides, passengers get sea-sick—grow quarrelsome—don’t sleep of nights—do not enjoy themselves much, as a general thing;—no, I never go as a passenger; nor, though I am something of a salt, do I ever go to sea as a Commodore, or a Captain, or a Cook. I abandon the glory and distinction of such offices to those who like them. For my part, I abominate all honorable respectable toils, trials, and tribulations of every kind whatsoever.

It is quite as much as I can do to take care of myself, without taking care of ships, barques, brigs, schooners, and what not. And as for going as cook,—though I confess there is considerable glory in that, a cook being a sort of officer on ship-board—yet, somehow, I never fancied broiling fowls;—though once broiled, judiciously buttered, and judgmatically salted and peppered, there is no one who will speak more respectfully, not to say reverentially, of a broiled fowl than I will. It is out of the idolatrous dotings of the old Egyptians upon broiled ibis and roasted river horse, that you see the mummies of those creatures in their huge bake-houses the pyramids.

No, when I go to sea, I go as a simple sailor, right before the mast, plumb down into the forecastle, aloft there to the royal mast-head. True, they rather order me about some, and make me jump from spar to spar, like a grasshopper in a May meadow. And at first, this sort of thing is unpleasant enough. It touches one’s sense of honor, particularly if you come of an old established family in the land, the Van Rensselaers, or Randolphs, or Hardicanutes. And more than all, if just previous to putting your hand into the tar-pot, you have been lording it as a country schoolmaster, making the tallest boys stand in awe of you.

The transition is a keen one, I assure you, from a schoolmaster to a sailor, and requires a strong decoction of Seneca and the Stoics to enable you to grin and bear it. But even this wears off in time. What of it, if some old hunks of a sea-captain orders me to get a broom and sweep down the decks? What does that indignity amount to, weighed, I mean, in the scales of the New Testament? Do you think the archangel Gabriel thinks anything the less of me, because I promptly and respectfully obey that old hunks in that particular instance?

Who ain’t a slave? Tell me that. Well, then, however the old sea-captains may order me about—however they may thump and punch me about, I have the satisfaction of knowing that it is all right; that everybody else is one way or other served in much the same way—either in a physical or metaphysical point of view, that is; and so the universal thump is passed round, and all hands should rub each other’s shoulder-blades, and be content. Again, I always go to sea as a sailor, because they make a point of paying me for my trouble, whereas they never pay passengers a single penny that I ever heard of.

On the contrary, passengers themselves must pay. And there is all the difference in the world between paying and being paid. The act of paying is perhaps the most uncomfortable infliction that the two orchard thieves entailed upon us. But being paid,—what will compare with it? The urbane activity with which a man receives money is really marvellous, considering that we so earnestly believe money to be the root of all earthly ills, and that on no account can a monied man enter heaven. Ah! how cheerfully we consign ourselves to perdition!

Finally, I always go to sea as a sailor, because of the wholesome exercise and pure air of the fore-castle deck. For as in this world, head winds are far more prevalent than winds from astern (that is, if you never violate the Pythagorean maxim), so for the most part the Commodore on the quarter-deck gets his atmosphere at second hand from the sailors on the forecastle. He thinks he breathes it first; but not so. In much the same way do the commonalty lead their leaders in many other things, at the same time that the leaders little suspect it.

But wherefore it was that after having repeatedly smelt the sea as a merchant sailor, I should now take it into my head to go on a whaling voyage; this the invisible police officer of the Fates, who has the constant surveillance of me, and secretly dogs me, and influences me in some unaccountable way—he can better answer than any one else. And, doubtless, my going on this whaling voyage, formed part of the grand programme of Providence that was drawn up a long time ago. It came in as a sort of brief interlude and solo between more extensive performances.

I take it that this part of the bill must have run something like this: “Grand Contested Election for the Presidency of the United States. “WHALING VOYAGE BY ONE ISHMAEL. “BLOODY BATTLE IN AFFGHANISTAN.” Though I cannot tell why it was exactly that those stage managers, the Fates, put me down for this shabby part of a whaling voyage, when others were set down for magnificent parts in high tragedies, and short and easy parts in genteel comedies, and jolly parts in farces—though I cannot tell why this was exactly; yet, now that I recall all the circumstances, I think I can see a little into the springs and motives which being cunningly presented to me under various disguises, induced me to set about performing the part I did, besides cajoling me into the delusion that it was a choice resulting from my own unbiased freewill and discriminating judgment.

Chief among these motives was the overwhelming idea of the great whale himself. Such a portentous and mysterious monster roused all my curiosity. Then the wild and distant seas where he rolled his island bulk; the undeliverable, nameless perils of the whale; these, with all the attending marvels of a thousand Patagonian sights and sounds, helped to sway me to my wish. With other men, perhaps, such things would not have been inducements; but as for me, I am tormented with an everlasting itch for things remote.

I love to sail forbidden seas, and land on barbarous coasts. Not ignoring what is good, I am quick to perceive a horror, and could still be social with it—would they let me—since it is but well to be on friendly terms with all the inmates of the place one lodges in. By reason of these things, then, the whaling voyage was welcome; the great flood-gates of the wonder-world swung open, and in the wild conceits that swayed me to my purpose, two and two there floated into my inmost soul, endless processions of the whale, and, mid most of them all, one grand hooded phantom, like a snow hill in the air.`
      },
      {
        id: 3,
        title: "CHAPTER 2. The Carpet-Bag. I stuffed a shirt or two into my old carpet-bag, tucked it under my arm, and started for Cape Horn and the Pacific. Quitting the good city of old Manhatto, I duly arrived in New Bedford. It was a Saturday night in December. Much was I disappointed upon learning that the little packet for Nantucket had already sailed, and that no way of reaching that place would offer, till the following Monday. As most young candidates for the pains and penalties of whaling stop at this same New Bedford, thence to embark on their voyage, it may as well be related that I, for one, had no idea of so doing.",
        content: `For my mind was made up to sail in no other than a Nantucket craft, because there was a fine, boisterous something about everything connected with that famous old island, which amazingly pleased me. Besides though New Bedford has of late been gradually monopolising the business of whaling, and though in this matter poor old Nantucket is now much behind her, yet Nantucket was her great original—the Tyre of this Carthage;—the place where the first dead American whale was stranded. Where else but from Nantucket did those aboriginal whalemen, the Red-Men, first sally out in canoes to give chase to the Leviathan?

And where but from Nantucket, too, did that first adventurous little sloop put forth, partly laden with imported cobblestones—so goes the story—to throw at the whales, in order to discover when they were nigh enough to risk a harpoon from the bowsprit? Now having a night, a day, and still another night following before me in New Bedford, ere I could embark for my destined port, it became a matter of concernment where I was to eat and sleep meanwhile. It was a very dubious-looking, nay, a very dark and dismal night, bitingly cold and cheerless.

I knew no one in the place. With anxious grapnels I had sounded my pocket, and only brought up a few pieces of silver,—So, wherever you go, Ishmael, said I to myself, as I stood in the middle of a dreary street shouldering my bag, and comparing the gloom towards the north with the darkness towards the south—wherever in your wisdom you may conclude to lodge for the night, my dear Ishmael, be sure to inquire the price, and don’t be too particular. With halting steps I paced the streets, and passed the sign of “The Crossed Harpoons”—but it looked too expensive and jolly there.

Further on, from the bright red windows of the “Sword-Fish Inn,” there came such fervent rays, that it seemed to have melted the packed snow and ice from before the house, for everywhere else the congealed frost lay ten inches thick in a hard, asphaltic pavement,—rather weary for me, when I struck my foot against the flinty projections, because from hard, remorseless service the soles of my boots were in a most miserable plight. Too expensive and jolly, again thought I, pausing one moment to watch the broad glare in the street, and hear the sounds of the tinkling glasses within.

But go on, Ishmael, said I at last; don’t you hear? get away from before the door; your patched boots are stopping the way. So on I went. I now by instinct followed the streets that took me waterward, for there, doubtless, were the cheapest, if not the cheeriest inns. Such dreary streets! blocks of blackness, not houses, on either hand, and here and there a candle, like a candle moving about in a tomb. At this hour of the night, of the last day of the week, that quarter of the town proved all but deserted.

But presently I came to a smoky light proceeding from a low, wide building, the door of which stood invitingly open. It had a careless look, as if it were meant for the uses of the public; so, entering, the first thing I did was to stumble over an ash-box in the porch. Ha! thought I, ha, as the flying particles almost choked me, are these ashes from that destroyed city, Gomorrah? But “The Crossed Harpoons,” and “The Sword-Fish?”—this, then must needs be the sign of “The Trap.” However, I picked myself up and hearing a loud voice within, pushed on and opened a second, interior door.

It seemed the great Black Parliament sitting in Tophet. A hundred black faces turned round in their rows to peer; and beyond, a black Angel of Doom was beating a book in a pulpit. It was a negro church; and the preacher’s text was about the blackness of darkness, and the weeping and wailing and teeth-gnashing there. Ha, Ishmael, muttered I, backing out, Wretched entertainment at the sign of ‘The Trap!’ Moving on, I at last came to a dim sort of light not far from the docks, and heard a forlorn creaking in the air; and looking up, saw a swinging sign over the door with a white painting upon it, faintly representing a tall straight jet of misty spray, and these words underneath—“The Spouter Inn:—Peter Coffin.

” Coffin?—Spouter?—Rather ominous in that particular connexion, thought I. But it is a common name in Nantucket, they say, and I suppose this Peter here is an emigrant from there. As the light looked so dim, and the place, for the time, looked quiet enough, and the dilapidated little wooden house itself looked as if it might have been carted here from the ruins of some burnt district, and as the swinging sign had a poverty-stricken sort of creak to it, I thought that here was the very spot for cheap lodgings, and the best of pea coffee.

It was a queer sort of place—a gable-ended old house, one side palsied as it were, and leaning over sadly. It stood on a sharp bleak corner, where that tempestuous wind Euroclydon kept up a worse howling than ever it did about poor Paul’s tossed craft. Euroclydon, nevertheless, is a mighty pleasant zephyr to any one in-doors, with his feet on the hob quietly toasting for bed. “In judging of that tempestuous wind called Euroclydon,” says an old writer—of whose works I possess the only copy extant—“it maketh a marvellous difference, whether thou lookest out at it from a glass window where the frost is all on the outside, or whether thou observest it from that sashless window, where the frost is on both sides, and of which the wight Death is the only glazier.

” True enough, thought I, as this passage occurred to my mind—old black-letter, thou reasonest well. Yes, these eyes are windows, and this body of mine is the house. What a pity they didn’t stop up the chinks and the crannies though, and thrust in a little lint here and there. But it’s too late to make any improvements now. The universe is finished; the copestone is on, and the chips were carted off a million years ago. Poor Lazarus there, chattering his teeth against the curbstone for his pillow, and shaking off his tatters with his shiverings, he might plug up both ears with rags, and put a corn-cob into his mouth, and yet that would not keep out the tempestuous Euroclydon.

Euroclydon! says old Dives, in his red silken wrapper—(he had a redder one afterwards) pooh, pooh! What a fine frosty night; how Orion glitters; what northern lights! Let them talk of their oriental summer climes of everlasting conservatories; give me the privilege of making my own summer with my own coals. But what thinks Lazarus? Can he warm his blue hands by holding them up to the grand northern lights? Would not Lazarus rather be in Sumatra than here? Would he not far rather lay him down lengthwise along the line of the equator; yea, ye gods!

go down to the fiery pit itself, in order to keep out this frost? Now, that Lazarus should lie stranded there on the curbstone before the door of Dives, this is more wonderful than that an iceberg should be moored to one of the Moluccas. Yet Dives himself, he too lives like a Czar in an ice palace made of frozen sighs, and being a president of a temperance society, he only drinks the tepid tears of orphans. But no more of this blubbering now, we are going a-whaling, and there is plenty of that yet to come.

Let us scrape the ice from our frosted feet, and see what sort of a place this “Spouter” may be.`
      },
      {
        id: 4,
        title: "CHAPTER 3. The Spouter-Inn. Entering that gable-ended Spouter-Inn, you found yourself in a wide, low, straggling entry with old-fashioned wainscots, reminding one of the bulwarks of some condemned old craft. On one side hung a very large oilpainting so thoroughly besmoked, and every way defaced, that in the unequal crosslights by which you viewed it, it was only by diligent study and a series of systematic visits to it, and careful inquiry of the neighbors, that you could any way arrive at an understanding of its purpose.",
        content: `Such unaccountable masses of shades and shadows, that at first you almost thought some ambitious young artist, in the time of the New England hags, had endeavored to delineate chaos bewitched. But by dint of much and earnest contemplation, and oft repeated ponderings, and especially by throwing open the little window towards the back of the entry, you at last come to the conclusion that such an idea, however wild, might not be altogether unwarranted. But what most puzzled and confounded you was a long, limber, portentous, black mass of something hovering in the centre of the picture over three blue, dim, perpendicular lines floating in a nameless yeast.

A boggy, soggy, squitchy picture truly, enough to drive a nervous man distracted. Yet was there a sort of indefinite, half-attained, unimaginable sublimity about it that fairly froze you to it, till you involuntarily took an oath with yourself to find out what that marvellous painting meant. Ever and anon a bright, but, alas, deceptive idea would dart you through.—It’s the Black Sea in a midnight gale.—It’s the unnatural combat of the four primal elements.—It’s a blasted heath.—It’s a Hyperborean winter scene.

—It’s the breaking-up of the icebound stream of Time. But at last all these fancies yielded to that one portentous something in the picture’s midst. That once found out, and all the rest were plain. But stop; does it not bear a faint resemblance to a gigantic fish? even the great leviathan himself? In fact, the artist’s design seemed this: a final theory of my own, partly based upon the aggregated opinions of many aged persons with whom I conversed upon the subject. The picture represents a Cape-Horner in a great hurricane; the half-foundered ship weltering there with its three dismantled masts alone visible; and an exasperated whale, purposing to spring clean over the craft, is in the enormous act of impaling himself upon the three mast-heads.

The opposite wall of this entry was hung all over with a heathenish array of monstrous clubs and spears. Some were thickly set with glittering teeth resembling ivory saws; others were tufted with knots of human hair; and one was sickle-shaped, with a vast handle sweeping round like the segment made in the new-mown grass by a long-armed mower. You shuddered as you gazed, and wondered what monstrous cannibal and savage could ever have gone a death-harvesting with such a hacking, horrifying implement.

Mixed with these were rusty old whaling lances and harpoons all broken and deformed. Some were storied weapons. With this once long lance, now wildly elbowed, fifty years ago did Nathan Swain kill fifteen whales between a sunrise and a sunset. And that harpoon—so like a corkscrew now—was flung in Javan seas, and run away with by a whale, years afterwards slain off the Cape of Blanco. The original iron entered nigh the tail, and, like a restless needle sojourning in the body of a man, travelled full forty feet, and at last was found imbedded in the hump.

Crossing this dusky entry, and on through yon low-arched way—cut through what in old times must have been a great central chimney with fireplaces all round—you enter the public room. A still duskier place is this, with such low ponderous beams above, and such old wrinkled planks beneath, that you would almost fancy you trod some old craft’s cockpits, especially of such a howling night, when this corner-anchored old ark rocked so furiously. On one side stood a long, low, shelf-like table covered with cracked glass cases, filled with dusty rarities gathered from this wide world’s remotest nooks.

Projecting from the further angle of the room stands a dark-looking den—the bar—a rude attempt at a right whale’s head. Be that how it may, there stands the vast arched bone of the whale’s jaw, so wide, a coach might almost drive beneath it. Within are shabby shelves, ranged round with old decanters, bottles, flasks; and in those jaws of swift destruction, like another cursed Jonah (by which name indeed they called him), bustles a little withered old man, who, for their money, dearly sells the sailors deliriums and death.

Abominable are the tumblers into which he pours his poison. Though true cylinders without—within, the villanous green goggling glasses deceitfully tapered downwards to a cheating bottom. Parallel meridians rudely pecked into the glass, surround these footpads’ goblets. Fill to this mark, and your charge is but a penny; to this a penny more; and so on to the full glass—the Cape Horn measure, which you may gulp down for a shilling. Upon entering the place I found a number of young seamen gathered about a table, examining by a dim light divers specimens of skrimshander.

I sought the landlord, and telling him I desired to be accommodated with a room, received for answer that his house was full—not a bed unoccupied. “But avast,” he added, tapping his forehead, “you haint no objections to sharing a harpooneer’s blanket, have ye? I s’pose you are goin’ a-whalin’, so you’d better get used to that sort of thing.” I told him that I never liked to sleep two in a bed; that if I should ever do so, it would depend upon who the harpooneer might be, and that if he (the landlord) really had no other place for me, and the harpooneer was not decidedly objectionable, why rather than wander further about a strange town on so bitter a night, I would put up with the half of any decent man’s blanket.

“I thought so. All right; take a seat. Supper?—you want supper? Supper’ll be ready directly.” I sat down on an old wooden settle, carved all over like a bench on the Battery. At one end a ruminating tar was still further adorning it with his jack-knife, stooping over and diligently working away at the space between his legs. He was trying his hand at a ship under full sail, but he didn’t make much headway, I thought. At last some four or five of us were summoned to our meal in an adjoining room.

It was cold as Iceland—no fire at all—the landlord said he couldn’t afford it. Nothing but two dismal tallow candles, each in a winding sheet. We were fain to button up our monkey jackets, and hold to our lips cups of scalding tea with our half frozen fingers. But the fare was of the most substantial kind—not only meat and potatoes, but dumplings; good heavens! dumplings for supper! One young fellow in a green box coat, addressed himself to these dumplings in a most direful manner. “My boy,” said the landlord, “you’ll have the nightmare to a dead sartainty.

” “Landlord,” I whispered, “that aint the harpooneer is it?” “Oh, no,” said he, looking a sort of diabolically funny, “the harpooneer is a dark complexioned chap. He never eats dumplings, he don’t—he eats nothing but steaks, and he likes ’em rare.” “The devil he does,” says I. “Where is that harpooneer? Is he here?” “He’ll be here afore long,” was the answer. I could not help it, but I began to feel suspicious of this “dark complexioned” harpooneer. At any rate, I made up my mind that if it so turned out that we should sleep together, he must undress and get into bed before I did.

Supper over, the company went back to the bar-room, when, knowing not what else to do with myself, I resolved to spend the rest of the evening as a looker on. Presently a rioting noise was heard without. Starting up, the landlord cried, “That’s the Grampus’s crew. I seed her reported in the offing this morning; a three years’ voyage, and a full ship. Hurrah, boys; now we’ll have the latest news from the Feegees.” A tramping of sea boots was heard in the entry; the door was flung open, and in rolled a wild set of mariners enough.

Enveloped in their shaggy watch coats, and with their heads muffled in woollen comforters, all bedarned and ragged, and their beards stiff with icicles, they seemed an eruption of bears from Labrador. They had just landed from their boat, and this was the first house they entered. No wonder, then, that they made a straight wake for the whale’s mouth—the bar—when the wrinkled little old Jonah, there officiating, soon poured them out brimmers all round. One complained of a bad cold in his head, upon which Jonah mixed him a pitch-like potion of gin and molasses, which he swore was a sovereign cure for all colds and catarrhs whatsoever, never mind of how long standing, or whether caught off the coast of Labrador, or on the weather side of an ice-island.

The liquor soon mounted into their heads, as it generally does even with the arrantest topers newly landed from sea, and they began capering about most obstreperously. I observed, however, that one of them held somewhat aloof, and though he seemed desirous not to spoil the hilarity of his shipmates by his own sober face, yet upon the whole he refrained from making as much noise as the rest. This man interested me at once; and since the sea-gods had ordained that he should soon become my shipmate (though but a sleeping-partner one, so far as this narrative is concerned), I will here venture upon a little description of him.

He stood full six feet in height, with noble shoulders, and a chest like a coffer-dam. I have seldom seen such brawn in a man. His face was deeply brown and burnt, making his white teeth dazzling by the contrast; while in the deep shadows of his eyes floated some reminiscences that did not seem to give him much joy. His voice at once announced that he was a Southerner, and from his fine stature, I thought he must be one of those tall mountaineers from the Alleghanian Ridge in Virginia. When the revelry of his companions had mounted to its height, this man slipped away unobserved, and I saw no more of him till he became my comrade on the sea.

In a few minutes, however, he was missed by his shipmates, and being, it seems, for some reason a huge favourite with them, they raised a cry of “Bulkington! Bulkington! where’s Bulkington?” and darted out of the house in pursuit of him. It was now about nine o’clock, and the room seeming almost supernaturally quiet after these orgies, I began to congratulate myself upon a little plan that had occurred to me just previous to the entrance of the seamen. No man prefers to sleep two in a bed. In fact, you would a good deal rather not sleep with your own brother.

I don’t know how it is, but people like to be private when they are sleeping. And when it comes to sleeping with an unknown stranger, in a strange inn, in a strange town, and that stranger a harpooneer, then your objections indefinitely multiply. Nor was there any earthly reason why I as a sailor should sleep two in a bed, more than anybody else; for sailors no more sleep two in a bed at sea, than bachelor Kings do ashore. To be sure they all sleep together in one apartment, but you have your own hammock, and cover yourself with your own blanket, and sleep in your own skin.

The more I pondered over this harpooneer, the more I abominated the thought of sleeping with him. It was fair to presume that being a harpooneer, his linen or woollen, as the case might be, would not be of the tidiest, certainly none of the finest. I began to twitch all over. Besides, it was getting late, and my decent harpooneer ought to be home and going bedwards. Suppose now, he should tumble in upon me at midnight—how could I tell from what vile hole he had been coming? “Landlord! I’ve changed my mind about that harpooneer.

—I shan’t sleep with him. I’ll try the bench here.” “Just as you please; I’m sorry I can’t spare ye a tablecloth for a mattress, and it’s a plaguy rough board here”—feeling of the knots and notches. “But wait a bit, Skrimshander; I’ve got a carpenter’s plane there in the bar—wait, I say, and I’ll make ye snug enough.” So saying he procured the plane; and with his old silk handkerchief first dusting the bench, vigorously set to planing away at my bed, the while grinning like an ape. The shavings flew right and left; till at last the plane-iron came bump against an indestructible knot.

The landlord was near spraining his wrist, and I told him for heaven’s sake to quit—the bed was soft enough to suit me, and I did not know how all the planing in the world could make eider down of a pine plank. So gathering up the shavings with another grin, and throwing them into the great stove in the middle of the room, he went about his business, and left me in a brown study. I now took the measure of the bench, and found that it was a foot too short; but that could be mended with a chair. But it was a foot too narrow, and the other bench in the room was about four inches higher than the planed one—so there was no yoking them.

I then placed the first bench lengthwise along the only clear space against the wall, leaving a little interval between, for my back to settle down in. But I soon found that there came such a draught of cold air over me from under the sill of the window, that this plan would never do at all, especially as another current from the rickety door met the one from the window, and both together formed a series of small whirlwinds in the immediate vicinity of the spot where I had thought to spend the night.

The devil fetch that harpooneer, thought I, but stop, couldn’t I steal a march on him—bolt his door inside, and jump into his bed, not to be wakened by the most violent knockings? It seemed no bad idea; but upon second thoughts I dismissed it. For who could tell but what the next morning, so soon as I popped out of the room, the harpooneer might be standing in the entry, all ready to knock me down! Still, looking round me again, and seeing no possible chance of spending a sufferable night unless in some other person’s bed, I began to think that after all I might be cherishing unwarrantable prejudices against this unknown harpooneer.

Thinks I, I’ll wait awhile; he must be dropping in before long. I’ll have a good look at him then, and perhaps we may become jolly good bedfellows after all—there’s no telling. But though the other boarders kept coming in by ones, twos, and threes, and going to bed, yet no sign of my harpooneer. “Landlord!” said I, “what sort of a chap is he—does he always keep such late hours?” It was now hard upon twelve o’clock. The landlord chuckled again with his lean chuckle, and seemed to be mightily tickled at something beyond my comprehension.

“No,” he answered, “generally he’s an early bird—airley to bed and airley to rise—yes, he’s the bird what catches the worm. But to-night he went out a peddling, you see, and I don’t see what on airth keeps him so late, unless, may be, he can’t sell his head.” “Can’t sell his head?—What sort of a bamboozingly story is this you are telling me?” getting into a towering rage. “Do you pretend to say, landlord, that this harpooneer is actually engaged this blessed Saturday night, or rather Sunday morning, in peddling his head around this town?

” “That’s precisely it,” said the landlord, “and I told him he couldn’t sell it here, the market’s overstocked.” “With what?” shouted I. “With heads to be sure; ain’t there too m`
      },
      {
        id: 5,
        title: "CHAPTER 4. The Counterpane. Upon waking next morning about daylight, I found Queequeg’s arm thrown over me in the most loving and affectionate manner.",
        content: `You had almost thought I had been his wife. The counterpane was of patchwork, full of odd little parti-coloured squares and triangles; and this arm of his tattooed all over with an interminable Cretan labyrinth of a figure, no two parts of which were of one precise shade—owing I suppose to his keeping his arm at sea unmethodically in sun and shade, his shirt sleeves irregularly rolled up at various times—this same arm of his, I say, looked for all the world like a strip of that same patchwork quilt.

Indeed, partly lying on it as the arm did when I first awoke, I could hardly tell it from the quilt, they so blended their hues together; and it was only by the sense of weight and pressure that I could tell that Queequeg was hugging me. My sensations were strange. Let me try to explain them. When I was a child, I well remember a somewhat similar circumstance that befell me; whether it was a reality or a dream, I never could entirely settle. The circumstance was this. I had been cutting up some caper or other—I think it was trying to crawl up the chimney, as I had seen a little sweep do a few days previous; and my stepmother who, somehow or other, was all the time whipping me, or sending me to bed supperless,—my mother dragged me by the legs out of the chimney and packed me off to bed, though it was only two o’clock in the afternoon of the 21st June, the longest day in the year in our hemisphere.

I felt dreadfully. But there was no help for it, so up stairs I went to my little room in the third floor, undressed myself as slowly as possible so as to kill time, and with a bitter sigh got between the sheets. I lay there dismally calculating that sixteen entire hours must elapse before I could hope for a resurrection. Sixteen hours in bed! the small of my back ached to think of it. And it was so light too; the sun shining in at the window, and a great rattling of coaches in the streets, and the sound of gay voices all over the house.

I felt worse and worse—at last I got up, dressed, and softly going down in my stockinged feet, sought out my stepmother, and suddenly threw myself at her feet, beseeching her as a particular favour to give me a good slippering for my misbehaviour; anything indeed but condemning me to lie abed such an unendurable length of time. But she was the best and most conscientious of stepmothers, and back I had to go to my room. For several hours I lay there broad awake, feeling a great deal worse than I have ever done since, even from the greatest subsequent misfortunes.

At last I must have fallen into a troubled nightmare of a doze; and slowly waking from it—half steeped in dreams—I opened my eyes, and the before sun-lit room was now wrapped in outer darkness. Instantly I felt a shock running through all my frame; nothing was to be seen, and nothing was to be heard; but a supernatural hand seemed placed in mine. My arm hung over the counterpane, and the nameless, unimaginable, silent form or phantom, to which the hand belonged, seemed closely seated by my bed-side.

For what seemed ages piled on ages, I lay there, frozen with the most awful fears, not daring to drag away my hand; yet ever thinking that if I could but stir it one single inch, the horrid spell would be broken. I knew not how this consciousness at last glided away from me; but waking in the morning, I shudderingly remembered it all, and for days and weeks and months afterwards I lost myself in confounding attempts to explain the mystery. Nay, to this very hour, I often puzzle myself with it. Now, take away the awful fear, and my sensations at feeling the supernatural hand in mine were very similar, in their strangeness, to those which I experienced on waking up and seeing Queequeg’s pagan arm thrown round me.

But at length all the past night’s events soberly recurred, one by one, in fixed reality, and then I lay only alive to the comical predicament. For though I tried to move his arm—unlock his bridegroom clasp—yet, sleeping as he was, he still hugged me tightly, as though naught but death should part us twain. I now strove to rouse him—“Queequeg!”—but his only answer was a snore. I then rolled over, my neck feeling as if it were in a horse-collar; and suddenly felt a slight scratch. Throwing aside the counterpane, there lay the tomahawk sleeping by the savage’s side, as if it were a hatchet-faced baby.

A pretty pickle, truly, thought I; abed here in a strange house in the broad day, with a cannibal and a tomahawk! “Queequeg!—in the name of goodness, Queequeg, wake!” At length, by dint of much wriggling, and loud and incessant expostulations upon the unbecomingness of his hugging a fellow male in that matrimonial sort of style, I succeeded in extracting a grunt; and presently, he drew back his arm, shook himself all over like a Newfoundland dog just from the water, and sat up in bed, stiff as a pike-staff, looking at me, and rubbing his eyes as if he did not altogether remember how I came to be there, though a dim consciousness of knowing something about me seemed slowly dawning over him.

Meanwhile, I lay quietly eyeing him, having no serious misgivings now, and bent upon narrowly observing so curious a creature. When, at last, his mind seemed made up touching the character of his bedfellow, and he became, as it were, reconciled to the fact; he jumped out upon the floor, and by certain signs and sounds gave me to understand that, if it pleased me, he would dress first and then leave me to dress afterwards, leaving the whole apartment to myself. Thinks I, Queequeg, under the circumstances, this is a very civilized overture; but, the truth is, these savages have an innate sense of delicacy, say what you will; it is marvellous how essentially polite they are.

I pay this particular compliment to Queequeg, because he treated me with so much civility and consideration, while I was guilty of great rudeness; staring at him from the bed, and watching all his toilette motions; for the time my curiosity getting the better of my breeding. Nevertheless, a man like Queequeg you don’t see every day, he and his ways were well worth unusual regarding. He commenced dressing at top by donning his beaver hat, a very tall one, by the by, and then—still minus his trowsers—he hunted up his boots.

What under the heavens he did it for, I cannot tell, but his next movement was to crush himself—boots in hand, and hat on—under the bed; when, from sundry violent gaspings and strainings, I inferred he was hard at work booting himself; though by no law of propriety that I ever heard of, is any man required to be private when putting on his boots. But Queequeg, do you see, was a creature in the transition stage—neither caterpillar nor butterfly. He was just enough civilized to show off his outlandishness in the strangest possible manners.

His education was not yet completed. He was an undergraduate. If he had not been a small degree civilized, he very probably would not have troubled himself with boots at all; but then, if he had not been still a savage, he never would have dreamt of getting under the bed to put them on. At last, he emerged with his hat very much dented and crushed down over his eyes, and began creaking and limping about the room, as if, not being much accustomed to boots, his pair of damp, wrinkled cowhide ones—probably not made to order either—rather pinched and tormented him at the first go off of a bitter cold morning.

Seeing, now, that there were no curtains to the window, and that the street being very narrow, the house opposite commanded a plain view into the room, and observing more and more the indecorous figure that Queequeg made, staving about with little else but his hat and boots on; I begged him as well as I could, to accelerate his toilet somewhat, and particularly to get into his pantaloons as soon as possible. He complied, and then proceeded to wash himself. At that time in the morning any Christian would have washed his face; but Queequeg, to my amazement, contented himself with restricting his ablutions to his chest, arms, and hands.

He then donned his waistcoat, and taking up a piece of hard soap on the wash-stand centre table, dipped it into water and commenced lathering his face. I was watching to see where he kept his razor, when lo and behold, he takes the harpoon from the bed corner, slips out the long wooden stock, unsheathes the head, whets it a little on his boot, and striding up to the bit of mirror against the wall, begins a vigorous scraping, or rather harpooning of his cheeks. Thinks I, Queequeg, this is using Rogers’s best cutlery with a vengeance.

Afterwards I wondered the less at this operation when I came to know of what fine steel the head of a harpoon is made, and how exceedingly sharp the long straight edges are always kept. The rest of his toilet was soon achieved, and he proudly marched out of the room, wrapped up in his great pilot monkey jacket, and sporting his harpoon like a marshal’s baton.`
      },
    ]
  },
];

// Extra originals (newly added)
const EXTRA_PRO_BOOKS: ProBook[] = [
  {
    id: 9,
    title: "Skybound Letters",
    author: "YDS PRO",
    cover: "✈️",
    coverStyle: COVER_STYLES.arctic,
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600",
    level: "B2",
    description: "A young aviation student finds secret letters hidden in weather balloons and follows them across continents.",
    chapters: [
      {
        id: 1,
        title: "The First Envelope",
        content: `Mara was used to chasing winds. As a second-year aviation student, she spent most mornings on the airfield, measuring pressure, logging cloud heights, and launching cheap latex balloons into the blue.

One cold dawn, her balloon returned with more than data. A white envelope, taped to the sensor pod, fluttered as it fell into the grass. On the front: "To the one who listens to the sky."

Inside was a short note, typed on an old machine.

"If you found this, you understand patience. Follow the coordinates at sunset. —A friend in the jet stream."`
      },
      {
        id: 2,
        title: "Jet Stream Messages",
        content: `The coordinates led Mara to an abandoned control tower at the far edge of the airfield. Rusted panels, broken glass, and the smell of dust greeted her. But on the console lay another envelope—this one sealed with a sticker of a small paper plane.

"There are more of us," the letter said. "We leave messages in the jet stream to remind ourselves the sky is still for dreamers. If you want to write back, launch at 10,000 feet with a silver ribbon."

Mara smiled. For the first time in months, her routine felt like an adventure. She bought a roll of silver ribbon on her way home.`
      },
      {
        id: 3,
        title: "Across Continents",
        content: `Over the next weeks, replies arrived from pilots, meteorologists, even a sailor crossing the Atlantic. The jet stream became a slow conversation above the clouds.

One message, though, stood out.

"Flight LT-204. We are losing fuel over the Atlantic. If anyone reads this, tell my daughter in Lisbon I watched the sunrise thinking of her."

Mara stared at the letter, heart pounding. It was dated two days ago.

She called her instructor, then the coast guard. Within an hour, an alert went out. That evening, news broke: an emergency landing on a remote airstrip had saved twelve passengers.

The sky had carried a plea, and someone listening had answered.`
      }
    ]
  },
  {
    id: 10,
    title: "The Glass Library",
    author: "YDS PRO",
    cover: "📚",
    coverStyle: COVER_STYLES.mystic,
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=600",
    level: "B1",
    description: "A hidden library inside a lighthouse teaches a village how stories can change the tide.",
    chapters: [
      {
        id: 1,
        title: "Light on the Hill",
        content: `Every night, the lighthouse on Greyhaven Hill blinked three short flashes, then one long. It kept ships away from the jagged rocks and reminded the sleepy village to check their shutters.

Elif, the new keeper, discovered more than lamps and lenses. Behind the spiral stairs, a glass door reflected her lantern. She pushed it open.

Shelves of books curved with the wall, each spine shimmering with trapped light. The room smelled of salt and ink. On the first table, a note: "Stories are lanterns. Keep them lit."`
      },
      {
        id: 2,
        title: "Tales for the Tide",
        content: `Elif started reading aloud during storms. Fishermen gathered, children huddled under blankets. She chose stories about brave sailors, clever healers, and cities built on sand that learned to float.

As she read, something strange happened. The lighthouse beam brightened, stretching farther into the fog. Sailors said the light felt warm, like someone guiding them home.

When the council tried to shut the library—"It wastes oil," they said—the villagers refused. "The stories keep the tide kind," an old captain argued. "Leave the books. We need the light."`
      },
      {
        id: 3,
        title: "Lantern Keepers",
        content: `One winter, a freight ship lost power near the rocks. Elif climbed the tower and read louder, voice cracking in the wind. Below, villagers lit their own lanterns along the shore, forming a ribbon of gold.

The ship saw the glow and turned just in time. The captain later wrote: "Your light was more than physics. It was hope."

The council never questioned the library again. They added new books, each with a small brass tag: "For Greyhaven—keep the light alive."

Elif realized the note was right. Stories were lanterns, and everyone in Greyhaven was now a keeper.`
      }
    ]
  },
  {
    id: 11,
    title: "Circles on the Ice",
    author: "YDS PRO",
    cover: "🧊",
    coverStyle: COVER_STYLES.storm,
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=600",
    level: "C1",
    description: "Two researchers in Antarctica uncover a pattern in the ice that retells human history in perfect circles.",
    chapters: [
      {
        id: 1,
        title: "The Perfect Ring",
        content: `Dr. Noor scanned the satellite photo again. On the Ross Ice Shelf, a perfect circle glowed faintly—one kilometer wide, smooth as polished glass.

"Wind?" her partner Jonas asked.

"Wind doesn't draw circles," Noor replied. They flew out the next morning, landing with a stuttering thud on blue ice.

Standing at the edge of the ring, she felt a low vibration, like a distant cello string. The ice here was thinner, layered like pages. "It's a record," she whispered. "Not of climate—of time."`
      },
      {
        id: 2,
        title: "Voices in Layers",
        content: `Core samples showed something impossible. Each centimeter of the ring contained microscopic lines that repeated like code. When amplified, they formed sound—a chorus of whispers.

They heard languages layered over millennia: ancient Greek, Sanskrit, lost dialects, radio broadcasts, street noise. The ice had recorded humanity's voice, pressed by pressure and time into frozen grooves.

Noor sent a clip to a linguist friend. He replied with one word: "Archive."

The world media erupted. Who had carved the circle? Nature? Humans? Something else?`
      },
      {
        id: 3,
        title: "Melt and Memory",
        content: `News crews arrived. Governments argued over ownership. But the Antarctic summer was rising, and the circle began to melt.

Noor and Jonas worked around the clock, mapping, sampling, translating. They broadcast one final stream—a mix of thousands of voices saying the same simple sentences across centuries: "We were here. We learned. Remember us."

When the ring finally vanished, only their data remained.

Years later, Noor lectured in a packed hall. She played the recording of the last layer—the one forming right before the melt.

It held her own voice, laughing in the wind, captured and pressed into history.

"The ice remembered us," she said. "The question is—will we remember the ice?"`
      }
    ]
  },
  {
    id: 30,
    title: "The Copper Sun Railway",
    author: "YDS PRO",
    cover: "🚂",
    coverStyle: COVER_STYLES.royal,
    image: "https://images.unsplash.com/photo-1474487548417-781a5a85870a?auto=format&fit=crop&q=80&w=600",
    level: "B2",
    description: "Engineers race to reopen a mountain railway before winter, balancing safety, community needs, and harsh weather.",
    chapters: [
      {
        id: 1,
        title: "Chapter 1: The Silent Tracks",
        content: `Five winters had buried the Copper Sun Railway under layers of ice as thick as a house. Mountain towns below survived on dwindling stockpiles and radioed pleas for medicine. Elif, the lead engineer, stepped off the helicopter and knelt beside the rails; rust flaked like old paint, and the steel rang dull under her glove.

"If we don't open this line before the next storm, clinics go dark," Arda, the logistics chief, said through his scarf. The wind swallowed his words, but the urgency was clear.

Elif stared at the ridge that blocked the line. Twenty days, ten kilometers of frozen ground, and a promise to communities that had waited five long years.`
      },
      {
        id: 2,
        title: "Chapter 2: Avalanche Warnings",
        content: `Drones traced the slope in blue lines; red overlays marked cornices ready to break free. Suna, the geologist, tapped the screen. "Any blasting here could drop the entire face on us," she said.

Arda paced. "So we don't blast. We melt our way through."

Elif sketched a loop of portable induction heaters fed by a hydrogen stack. It was experimental, expensive, and unproven at altitude—but waiting for spring would abandon the promise they made. The team voted: melt or go home. They chose to melt.`
      },
      {
        id: 3,
        title: "Chapter 3: Hydrogen at Altitude",
        content: `The hydrogen stack arrived in thirty crates, each part labeled in frost. Building it at 2,800 meters felt like solving a puzzle with numb fingers. Cables stiffened in minutes; wrenches froze to bolts unless warmed by pocket torches.

By midnight, the array hummed like a hive. Elif dozed in snatches, waking at every pitch change. If pressure dropped, the heaters would die and the line would refreeze before sunrise. Red LEDs blinked steady. The melt could begin.`
      },
      {
        id: 4,
        title: "Chapter 4: The Melt Line",
        content: `Orange induction clamps gripped the rails like a chain of lanterns. Ice hissed, cracked, and exhaled ancient air in sharp whistles. Progress was slow—one meter a minute—but for the first time in years, metal saw daylight.

Families watched from a safe ridge. A girl in a red hat shouted over the wind, "My father says the first train will bring books again!" Elif raised a thumb. "Then let's make sure it does." Steam plumes marked each small victory.`
      },
      {
        id: 5,
        title: "Chapter 5: Night Shift",
        content: `Night shifts kept the melt ahead of the cold, but exhaustion crept in. Coffee turned slush in cups; headlamps dimmed in the sleet. A sudden gust ripped a heater loose and sent it skidding toward the ravine.

Arda dove, catching the cable as his gloves smoked. They pulled the unit back, breathing hard. "Double-anchor everything," he ordered. "The mountain keeps whatever we don't tie down." From then on, two anchors per clamp became law.`
      },
      {
        id: 6,
        title: "Chapter 6: Fault Line",
        content: `Suna's seismic sensors chirped: micro-quakes beneath kilometer seven. A buried fault cut across the route. "If the ground shifts while a train is on it, we could twist the rails," she warned.

Elif redrafted the design overnight, adding a flexible ballast bed reinforced with steel mesh. It meant two extra helicopter runs of gravel and mesh, and it pushed the schedule, but no one argued. Safety was slower, but it was certain.`
      },
      {
        id: 7,
        title: "Chapter 7: The Storm Front",
        content: `The forecast missed by a day. A polar storm slammed the valley at noon, burying heaters under drifting snow within minutes. Visibility dropped to arm's length; the melt line vanished in white.

"Shut the line, save the stack," Elif called. Valves closed, cables were coiled, and the hydrogen array was wrapped in thermal blankets. They rode out the night in the ops tent, radios crackling with voices from cut-off clinics. The stakes rose with the wind.`
      },
      {
        id: 8,
        title: "Chapter 8: After the White Silence",
        content: `Morning brought a blue sky and drifts taller than a person. They dug out the heaters one by one; every unit survived. The hydrogen stack hummed back to life on the first start. Relief tasted like fresh, warm soup that villagers carried up the trail.

An elder pressed a small copper pendant into Elif's palm. "My father laid these rails," he said. "Thank you for waking them." The pendant stayed in Elif's pocket for the rest of the project.`
      },
      {
        id: 9,
        title: "Chapter 9: First Test Run",
        content: `A maintenance trolley rolled over the cleared track, sensors streaming vibration and alignment data. At the fault crossing, the mesh flexed, then relaxed back to level. Numbers stayed in the green. No twists, no warps.

Arda checked his watch. "We promised twenty days. We're three hours early."

For the first time in weeks, Elif exhaled without seeing steam. "Then let's not waste them. Signal the train."`
      },
      {
        id: 10,
        title: "Chapter 10: The Copper Sun Rises",
        content: `At dawn, a low whistle echoed off the cliffs. Headlights pierced the cold air as the first supply train crawled out of the tunnel, wheels ringing on rails newly freed. Villagers lined the right-of-way, waving flags and scarves; children sprinted alongside until the engineer eased the throttle.

The lead car carried crates of medicine, books, and solar batteries stacked to the roof. Elif stood by the rail bed, copper pendant warm in her glove. The Copper Sun Railway was alive again—not just steel and sleepers, but a promise stitched back into the mountains.`
      }
    ]
  },
  {
    id: 31,
    title: "Garden Beneath the Glacier",
    author: "YDS PRO",
    cover: "🌿",
    coverStyle: COVER_STYLES.mystic,
    image: "https://images.unsplash.com/photo-1524227894982-b7e6c433c2a1?auto=format&fit=crop&q=80&w=600",
    level: "B1",
    description: "A botanist discovers a living garden sealed under a melting glacier and must decide how to protect it.",
    chapters: [
      {
        id: 1,
        title: "Chapter 1: Meltwater",
        content: `Dr. Maia rinsed her sample jars in a stream that bit at her skin. The glacier above camp had retreated another meter overnight, sending torrents of meltwater and centuries of secrets downhill.

Under her field scope, she found pollen grains from plants that did not grow anywhere on this mountain. "You shouldn't be here," she whispered. The glacier was hiding something alive.`
      },
      {
        id: 2,
        title: "Chapter 2: The Sinkhole",
        content: `Two days later, a boom rolled across camp. A slab of ice had given way, revealing a dark circular shaft. Maia and her guide, Tenzin, lowered a rope camera into the opening.

The feed lit up emerald. Ferns, mosses, and a canopy of broad leaves shimmered under diffuse light. "A forest under the ice?" Tenzin whispered. Maia's heart hammered. "A hidden garden, sealed for centuries," she said.`
      },
      {
        id: 3,
        title: "Chapter 3: Descent",
        content: `Harness clipped, Maia eased into the shaft. The air shifted from razor cold to damp and warm, fogging her goggles. Walls dripped with bioluminescent moss, casting a steady green light.

She landed on springy soil instead of ice. Giant ferns arched over her, their fronds glistening. Somewhere deeper, water dripped in a slow, patient rhythm. The glacier had been a lid over an entire ecosystem.`
      },
      {
        id: 4,
        title: "Chapter 4: Hidden Canopy",
        content: `Maia's notebook filled quickly. Blue-veined ferns she had only read about in fossil studies grew beside translucent lilies that caught the moss-glow like glass. Vines folded their leaves when her hand brushed them, conserving moisture.

No insects hummed; no birds called. The silence felt reverent, like a green cathedral. Light came from the moss rather than the absent sun. Evolution had written a different rulebook down here.`
      },
      {
        id: 5,
        title: "Chapter 5: The Silent Lake",
        content: `At the center lay a lake, dark and mirror-still. Beneath the surface, pale root networks braided like lace. Maia dipped a probe; dissolved oxygen spiked higher than any alpine lake she had tested.

Shapes glided below—blind fish with faintly glowing scales, steering by pressure instead of sight. Life had not just survived here; it had adapted elegantly in silence.`
      },
      {
        id: 6,
        title: "Chapter 6: Messages in Spores",
        content: `A brush against a fern released a soft cloud of spores. Under Maia's portable microscope, the spores carried ridged patterns that looked almost like writing. She snapped photos and sent them to a colleague.

The reply came fast: "Patterns match late Pleistocene pollen. You're looking at a living archive."

The garden was more than beautiful; it was a memory bank of a climate long gone.`
      },
      {
        id: 7,
        title: "Chapter 7: Ice Tremors",
        content: `A low rumble rolled through the cavern, rippling the lake. Tenzin's voice crackled through the radio. "Outer wall is moving. We need to get out now."

Maia packed vials and leaves with shaking hands. Above, the glacier groaned like a waking giant. She stole one last look at the glowing moss and silver fish. "I'll come back," she whispered, before climbing into the cold.`
      },
      {
        id: 8,
        title: "Chapter 8: Exit to Sunlight",
        content: `Cracks spidered across the lip of the shaft as they hauled up. Sunlight stabbed Maia's eyes after the soft green below. Behind her, the opening narrowed under falling ice, hiding the garden again.

She hugged the sample case to her chest. The world needed to know this place existed, but exposure could destroy it. Protecting the garden meant sharing just enough—and no more.`
      },
      {
        id: 9,
        title: "Chapter 9: The Debate",
        content: `At the university auditorium, Maia played footage of luminous moss and blind fish on a towering screen. The hall gasped, then buzzed with questions about access, patents, documentaries.

"No tourism. No exploitation," Maia said firmly. "We study with respect or we don't go back."

Funding offers poured in, tied to publicity. She turned them down. A promise made under ice was still a promise under lights.`
      },
      {
        id: 10,
        title: "Chapter 10: Stewards of the Hidden Garden",
        content: `A year later, an international team was formed—not to advertise the garden, but to guard it. Remote sensors watched the ice roof; research permits allowed brief, quiet visits only during stable weather.

Maia descended again, moving as gently as if entering a library. The moss still glowed; the blind fish still drew silver arcs in the lake. Some discoveries are not trophies—they are trusts, handed carefully from one generation to the next.`
      }
    ]
  },
  {
    id: 32,
    title: "Signal from Kuyu-9",
    author: "YDS PRO",
    cover: "📡",
    coverStyle: COVER_STYLES.storm,
    image: "https://images.unsplash.com/photo-1614728853913-1e221165842e?auto=format&fit=crop&q=80&w=600",
    level: "C1",
    description: "Deep in a Martian mine, a pulsing signal forces a crew to question what was left there before them—and whether to answer.",
    chapters: [
      {
        id: 1,
        title: "Chapter 1: Static",
        content: `Kuyu-9 sat three kilometers under the red Martian crust, carved into layers of hydrogen ice and dust. During shift change, the comms panel flickered, filling the control room with a thin veil of static.

"No scheduled traffic on this band," Deren, the comms engineer, said. Yet on the spectrum display, a clean pulse rose at perfect intervals, like a heartbeat in stone.`
      },
      {
        id: 2,
        title: "Chapter 2: Echoes in the Rock",
        content: `Geophones buried in the walls confirmed what their ears sensed: the pulse wasn't only radio. The rock itself vibrated in time, as if someone tapped from the other side.

Operations chief Lale gathered the crew. "This isn't a loose conduit," she said. "The strata are answering."`
      },
      {
        id: 3,
        title: "Chapter 3: Translation Attempts",
        content: `Deren measured the gaps between pulses. The sequence echoed Fibonacci, but with deliberate deviations. "This isn't random noise," he said. "Something is encoding a pattern."

Machine-learning models chewed on the data. No clear words emerged, but one suggestion surfaced: the pattern kept asking for repetition—as if it wanted a call-and-response.`
      },
      {
        id: 4,
        title: "Chapter 4: The First Reply",
        content: `Against protocol, Lale authorized a single reply: a matching pulse sent back through the comms array and geophones. The rock answered immediately—faster, then slower, settling into a shared rhythm.

Over dinner, miners traded theories. An abandoned colony beacon? Martian geology singing? Or a recording impressed into crystal veins decades ago, now awakened by their drills?`
      },
      {
        id: 5,
        title: "Chapter 5: Pressure Rise",
        content: `Alarms lit in the deep borehole. Pressure climbed, carrying traces of hydrogen, neon—and cadmium-186, an isotope that did not occur naturally and required human fabrication.

"Someone made this down here," Deren said. But Kuyu-9 had been mothballed for twenty years. Their crew had been onsite for only ten days. Who else had touched this place?`
      },
      {
        id: 6,
        title: "Chapter 6: Lockdown",
        content: `Red strobes bathed the corridors as lockdown engaged. Ventilation shifted to minimum. "No one moves without clearance," Lale ordered. "Assume the signal and the gas are linked."

The crew split: one team monitored the pulses; another traced ventilation shafts for hidden chambers. Under stress, trust frayed. Eyes lingered too long on old access logs and each other's badges.`
      },
      {
        id: 7,
        title: "Chapter 7: The Hidden Room",
        content: `In a forgotten vent shaft, they found a rusted hatch not shown on any plan. Behind it lay a narrow room of glass tubes, ancient data strips, and a dust-coated recorder.

Deren powered it with a portable cell. Static, then a recorded voice: "Kuyu-9 experimental broadcast protocol. If you hear this—do not return. The ground remembers."`
      },
      {
        id: 8,
        title: "Chapter 8: Memory of Dust",
        content: `The pulses quickened as the recording played, as if the rock itself reacted to the words. Lale pieced it together: early Kuyu-9 experiments had tried to "write" data into salt and ice crystals with vibration.

"The crust is echoing what was written," she said. "Our replies woke the archive." The mine was not just a hole—it was a memory medium.`
      },
      {
        id: 9,
        title: "Chapter 9: Extraction or Escape",
        content: `Central command ordered: collect gas samples, record the signal, then evacuate. But cadmium-186 in the mix meant lethal exposure if containment slipped. Minutes mattered.

The crew divided labor—Deren captured a final full-band recording while Lale armed the escape capsules. The walls now thumped in a steady, insistent rhythm. Lights flickered in time, as if the station itself had a pulse.`
      },
      {
        id: 10,
        title: "Chapter 10: The Last Pulse",
        content: `As the escape capsules fired toward the surface, the comms panel flared one last time. The sequence shifted, resolving into two long pulses, three short, two long.

"That's an SOS," Deren whispered. But who was calling for help—the crew, or whatever intelligence their drills had awakened?

Kuyu-9 fell silent behind them. The recording raced toward Earth, carrying Mars's final heartbeat and a question that would haunt every debrief: how long had something been waiting down there to be heard?`
      }
    ]
  },
  {
    id: 33,
    title: "Letters from the Floating City",
    author: "YDS PRO",
    cover: "✉️",
    coverStyle: COVER_STYLES.ocean,
    image: "https://images.unsplash.com/photo-1544983056-b8c199587a8b?auto=format&fit=crop&q=80&w=600",
    level: "B2",
    description: "A courier in a floating ocean city discovers that the letters he carries can warn, heal, and reshape the community.",
    chapters: [
      {
        id: 1,
        title: "Chapter 1: Dawn Route",
        content: `Kai pedaled his sea-bike through the blue corridors of Pelagia, a city lashed to pontoons above a deep Pacific trench. His canvas bag thumped with sixty envelopes, six platforms, and one orange sunrise.

Bills, party invites, postcards—on paper they were ordinary. But each envelope opened a door into someone else's day, and Kai loved being the one who knocked.`
      },
      {
        id: 2,
        title: "Chapter 2: The Unstamped Envelope",
        content: `One envelope had no stamp and no platform code. Across the front, in careful ink: "To the one who listens." Kai showed it to Lina, the postmaster.

"Off-route," Lina said, squinting. "If anyone listens, it's the old radio tower. Take it there on your way back."

Curiosity outweighed protocol. Kai slid the letter back into his bag.`
      },
      {
        id: 3,
        title: "Chapter 3: Radio Tower Stories",
        content: `The radio tower was Pelagia's oldest spine of steel and salt. Inside, cables hummed and the air smelled of dusted circuits. Kai knocked; a voice rasped, "Come in, child."

An elderly woman named Elara took the letter. She held the blank page to the window. Words bloomed in sunlight: "Leak at Platform 6. Act now."

Elara nodded once. "Listening saves time," she said, already reaching for her transmitter.`
      },
      {
        id: 4,
        title: "Chapter 4: Leak at Platform 6",
        content: `Kai sprinted to Platform 6, repeating the warning. Engineers checked valves; a hairline crack hid behind a pressure panel. They patched it before the next tide.

Back at the post hall, Lina asked, "How did you know?" Kai shrugged. "A letter wanted to be heard." The stack of mail on his desk suddenly looked less ordinary.`
      },
      {
        id: 5,
        title: "Chapter 5: Currents of Memory",
        content: `Elara played Kai a crackling archive: voices from Pelagia's first years, passing warnings, jokes, and poems over the radio because paper was scarce. "Couriers keep the city's pulse," she said. "You carry more than ink."

Kai began to notice the weight of words. A birthday card could steady a lonely diver; a utility notice could spark a community fix. The bag on his back felt heavier in the best way.`
      },
      {
        id: 6,
        title: "Chapter 6: Storm Season",
        content: `Storm season churned the Pacific. Chains groaned, platforms rose and fell like slow breath. Kai rode through sheets of rain, shielding his bag with his body.

One envelope bled ink where water seeped in. Hidden words appeared: "Please stay." The letter belonged to a young engineer ready to transfer off-city. He read it, blinked, and unpacked his duffel. Days later, his quick weld kept a storm gate from failing.`
      },
      {
        id: 7,
        title: "Chapter 7: The Floating Library",
        content: `Platform 2 unveiled a floating library: waterproof crates of books hung by rope, swaying gently with the waves. Librarian Nila handed Kai a small parcel. "For Elara. It's the catalog of lost voices."

Inside, Elara found digitized copies of early broadcasts. "Pelagia is remembering itself," she murmured, eyes shining. Letters were stitching past to present.`
      },
      {
        id: 8,
        title: "Chapter 8: Tides of Change",
        content: `A government notice arrived at dawn: Pelagia would be repositioned; two small platforms slated for decommissioning. Panic rippled. Letters poured in—petitions, thank-yous, quiet goodbyes.

Kai delivered a final letter to the smallest platform. Inside was a child's hand-drawn map of the city with a note: "Please don't forget us." He could not forget. Neither could the council once the map went public. Plans changed.`
      },
      {
        id: 9,
        title: "Chapter 9: Holding the Anchors",
        content: `The community rallied. Engineers reinforced anchor chains; divers welded through the night. Elara reopened an old frequency to share updates and poems; Nila read stories over the speakers to steady nerves.

Kai ferried letters and news between platforms, words acting like rope between drifting docks. The government compromised: the threatened platforms would stay, and the city would shift more gently to new currents.`
      },
      {
        id: 10,
        title: "Chapter 10: New Routes",
        content: `Pelagia eased onto its new course, platforms creaking in unison. Kai set out on his dawn route with a bag full of fresh stories to carry.

Elara pressed a small radio into his hand. "You're not just a carrier now," she said. "You're a listener. The city speaks through you."

Kai pedaled into the sunrise, letters tapping his back in rhythm with the waves. The route was new, but the work—connecting people—felt truer than ever.`
      }
    ]
  },
  {
    id: 34,
    title: "The Archivist of Wind Harbor",
    author: "YDS PRO",
    cover: "🗄️",
    coverStyle: COVER_STYLES.crimson,
    image: "https://images.unsplash.com/photo-1489447068241-b3490214e879?auto=format&fit=crop&q=80&w=600",
    level: "B1",
    description: "In a seaside town, a young librarian learns to capture stories carried on the wind and preserve the town's living memory.",
    chapters: [
      {
        id: 1,
        title: "Chapter 1: Boxes of Air",
        content: `Defne's first day at the Wind Harbor library smelled of salt and paper. In the basement she found dusty crates labeled "Wind Archive." Inside were dozens of empty glass jars and a handwritten note: "Open after storms. Listen closely."`
      },
      {
        id: 2,
        title: "Chapter 2: First Wind",
        content: `A hard wind rolled in from the sea that evening. Remembering the note, Defne cracked open a jar. Salt air rushed out—along with a thread of whispers. She heard a fisherman describing a night storm from decades ago, his voice fading like surf.

Defne scribbled every word, then sealed the jar. The whispers stopped, leaving only the ticking of the library clock.`
      },
      {
        id: 3,
        title: "Chapter 3: The Skeptic",
        content: `Mayor Cem stopped by for a routine inspection. "Stories in the wind? Sounds like superstition," he said.

Defne handed him a jar. When he opened it, a child's laugh and the clatter of wooden blocks spilled into the room. Cem's eyes widened; he was hearing his own memory of losing a toy boat by the pier. His skepticism softened. "Maybe some stories travel farther than we think," he murmured.`
      },
      {
        id: 4,
        title: "Chapter 4: Storm Surge",
        content: `A major storm warning rattled the harbor. Boats were tied, shutters slammed, and Defne lined up empty jars on the library table. "Today's wind will be loud," she said to herself.

When the storm hit, the roof groaned and windows shook. Defne opened jars one by one, catching fragments of voices—an old captain's farewell, a lullaby hummed by someone far offshore, the creak of masts from ships long sunk. She capped each jar as if bottling lightning.`
      },
      {
        id: 5,
        title: "Chapter 5: Voices of the Past",
        content: `After the storm, Defne replayed the captured sounds. A captain describing his last voyage home. A lighthouse keeper in 1903 noting a new light on the horizon. The final, calm thought of a diver who never resurfaced.

She transcribed them and read them aloud in the town square. People listened in reverent silence; some wiped tears, others smiled at names they hadn't heard in years.`
      },
      {
        id: 6,
        title: "Chapter 6: The Missing Page",
        content: `The town chronicle had a missing page listing harbor workers lost in a 1940 accident. No one remembered all the names.

Defne opened a jar on a quiet, breezy night. Laughter and roll call echoed out—names spoken proudly. She wrote them down, restoring the lost page. The next day, families placed flowers by the harbor wall under newly added names.`
      },
      {
        id: 7,
        title: "Chapter 7: Lighthouse Signal",
        content: `The lighthouse beam had begun to sputter; the aging keeper struggled with repairs. In one jar, Defne heard an old voice calmly reciting a maintenance checklist—lamp oil levels, mirror angles, the order of gears.

She delivered the notes to the keeper. Together they replaced bulbs and polished mirrors. That night, the beam cut cleanly across the bay again, steady as a metronome.`
      },
      {
        id: 8,
        title: "Chapter 8: The Visitor",
        content: `A traveling writer arrived, drawn by rumors of the Wind Archive. He asked to hear everything and write a book.

Defne uncapped a single jar. The writer listened, then closed it gently. "These stories should be shared," he said.

"Yes," Defne replied, "but with care. They belong to the people who breathed them." They drafted a plan: excerpts with names removed, proceeds to fund the library and the families whose memories filled the jars.`
      },
      {
        id: 9,
        title: "Chapter 9: Festival of Winds",
        content: `For the first time in years, the town held a Festival of Winds. Residents brought their own jars, whispering poems, jokes, and blessings into them. Children hung wind chimes from the pier; fishermen sang old sea shanties into the gusts.

Defne watched the archive grow with present-day voices. The wind carried not just the sea's memory, but the town's living breath.`
      },
      {
        id: 10,
        title: "Chapter 10: Keeper of the Air",
        content: `Defne opened a new room in the library: the Wind Room. Shelves of jars lined the walls; transcripts and photographs hung between them. A small table and two chairs waited in the center. On the door she placed a sign: "Enter to listen."

A breeze slipped under the sill, rattling one jar just enough to make it whisper. Defne smiled. Wind Harbor was no longer just a town—it was a book written in air, and she was its careful archivist.`
      }
    ]
  }
];

// New original books
export const PRO_BOOKS: ProBook[] = [
  ...BASE_PRO_BOOKS,
  ...NEW_PRO_BOOKS,
  ...EXTRA_PRO_BOOKS,
];
