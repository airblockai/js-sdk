track - collects data, converts into object

- dispatch - validate config
- process - opt out check, and push to timeline
- timeline.push - adds to queue
- scheduleApply - reads first item from queue & deletes it
- destination.execute - converts event into another object
- addToQueue - adds to queue in destination
- schedule & saveEvents - flushing & adds to localstorage
- flush - creates 2 lists & chunks `list`, later = queue
- chunk & send - chuck creates batches, returns batches & send sends each batch to server

TODO

- metamask events - metamask_wallets, metamask_accountsChanged, metamask_chainChanged, metamask_message
- metamask error event

---

- Server response handling
- Check how to not use await for init function
