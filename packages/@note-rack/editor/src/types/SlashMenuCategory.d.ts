import type SlashMenuOption from './SlashMenuOption';

/**
 * A slash menu category is a group of slash menu options
 * @see SlashMenuOption
 * @see useSlashMenu
 * 
 * @example
 * const slashMenuCategories: SlashMenuCategory[] = [
 *  {
 *    name: 'Emojis',
 *    options: [
 *      {  
 *        name: 'Smile',  
 *        description: 'Insert a smile emoji',
 *        image: 'https://example.com/smile.png',
 *        action: () => {
 *          // Insert smile emoji
 *        },
 *      },
 *    ],
 *   },
 * ];
 */
type SlashMenuCategory = {
  /**
   * Name of the category
   */
  name: string;
  /**
   * List of options in the category
   * @see SlashMenuOption
   * @see useSlashMenu
   */
  options: SlashMenuOption[];
}

export default SlashMenuCategory;
