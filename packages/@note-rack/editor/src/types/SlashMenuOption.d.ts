/**
 * A slash menu is a menu that appears when the user types a slash (/) in a
 * text input. It allows the user to select an option from a list of options.
 */
type SlashMenuOption = {
  /**
   * Name of the option
   */
  name: string;
  /**
   * Short description of the option
   */
  description?: string;
  /**
   * Image to display next to the option
   */
  image: string;
  /**
   * Action to perform when the option is selected
   */
  action: () => void;
}

export default SlashMenuOption;