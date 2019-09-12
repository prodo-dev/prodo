Find ways to make typescript happy when importing subfolders or images:

```
// @ts-ignore
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";
// @ts-ignore
import MdAlarm from "react-icons/lib/md/access-alarm";
```

Find correct/elegant way to handle refs in functional components:

```
ref={el => {this.listEnd = el }}
```

Find correct/elegant way to handle prevProps with hooks:

```
// see Lists/Cards
componentDidUpdate = prevProps => {
   // Scroll to bottom of list if a new card has been added
   if (
     this.props.cards[this.props.cards.length - 2] ===
     prevProps.cards[prevProps.cards.length - 1]
   ) {
     this.scrollToBottom();
   }
};
```

Refactor the router instead of using react-router-dom...

```
// see BoardHeader/BoardDeleter
export default withRouter(BoardDeleter);
```
