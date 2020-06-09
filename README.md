## ft-task

# Assumptions

- The client doesn't want partial data returned.
- The client is happy for attributes to be overwritten should an attribute with the same name occur in a response. 
from a request at a later position in the array.

# Solution:

- If any url fails to return JSON then the whole function will fail and reject with an error.
- The error will give the url that failed.  
- It fails fast so there is no guarantee that subsequent urls would have succeeded.
- Promise.all is used to send the requests together.
- axios lib used for convenience 

# Possible changes / improvements - subject to requirements:

- add a catch to each of the requests if we want to not 'fail-fast' (on the promise.all) and return the data that 
was successfully fetched.
- retry any failures.
- add more information into the data returned.
- not merge data / attributes with the same name - keep each response separate within an array.