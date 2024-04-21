export class ValueObject<Props> {
  protected props: Props;

  protected constructor(props: Props) {
    this.props = props;
  }

  public equals(vo: ValueObject<unknown>) {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (vo.props === undefined) {
      return false;
    }

    /**
     * `===` cannot compare objects and complex structures, only primitives types like strings or numbers
     * so we turn the props objects into string and compare two strings
     */
    return JSON.stringify(vo.props) === JSON.stringify(this.props);
  }
}
