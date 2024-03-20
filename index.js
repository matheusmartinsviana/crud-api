const express = require('express');
const port = 3000;
const app = express();
app.use(express.json());

const users = [];
const posts = [];

app.get('/', (req, res) => {
    //show all routes on default route for who request
    res.send({
        route_get_users: '/user/list',
        route_create_users: '/user/create',
        route_update_users: '/user/update/:id',
        route_update_users: '/user/delete/:id',
        route_create_posts: '/post/create/:userId',
        route_create_posts: '/post/update/:id',
        route_create_posts: '/post/delete/:id',
        route_create_posts: '/post/user/:userId',
    });
});

app.get('/user/list', (req, res) => { // use this route to see all users created
    res.json(users);
});

app.post('/user/create', (req, res) => { // use this route to create a new user
    const { name, email } = req.body;

    let id = 0;

    for (const user of users) { // foreach to verify the correct index
        if (user.id > id) {
            id = user.id;
        }
    }

    const user = {
        id: id + 1,
        name,
        email
    };
    users.push(user); // push user to users

    res.status(201).json(user); //send a response to who request
});

app.put('/user/update/:id', (req, res) => { // edit or update some user info
    const { id } = req.params;
    const { name, email } = req.body;

    const index = users.findIndex(u => u.id === Number(id)); //verify if id exists

    if (index === -1) {
        return res.status(404).json({ error: 'user not found' });
    }

    users[index] = {
        id: Number(id), //convert to number because variable from req.params is a string for default
        name,
        email
    };

    res.status(200).json(users[index]); // send a sucess message and show user changed
});

app.delete('/user/delete/:id', (req, res) => { //use this route to delete some user
    const { id } = req.params;

    const index = users.findIndex(u => u.id === Number(id));

    if (index === -1) {
        return res.status(404).json({ error: 'User not found. Are you sure that you create this user?...' });
    }

    users.splice(index, 1);

    res.status(204).send(); // send a sucess message to who request
});

/*
    - create post -
route: /post/create/:post author id
body:
{
    "title": "your title",
    "description": "your description"
}
*/
app.post('/post/create/:userId', (req, res) => {
    const { userId } = req.params; //request a idUserfrom url params
    const { title, description } = req.body; // request two variable from request body

    let postId = 0; // keep id 0

    const index = users.findIndex(u => u.id === Number(userId)); // verify if this user exist
    if (index === -1) {
        return res.status(404).json({ error: 'We cannot find this user. Try again later' });
    }

    for (const post of posts) { // forEach to do some action to every childrens from posts (index 1 = post, index 2 = post...)
        if (post.postId > postId) {
            postId = post.postId;
        }
    }

    const post = { // create a post with body and params values
        postId: postId + 1,
        title,
        description,
        userId: Number(userId) //convert to number, because variable from url is string
    };
    posts.push(post); // push this post on array(posts)

    res.status(201).json(post);  // send a response to who request
});

/*
    - update post -
route: /post/update/:id that you wanna change
body:
{
    "title": "edit your title",
    "description": "edit your description"
}
*/
app.put('/post/update/:id', (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const index = posts.findIndex(p => p.postId === Number(id));

    if (index === -1) {
        return res.status(404).json({ error: 'Post não encontrado' });
    }

    posts[index] = {
        postId: Number(id),
        title,
        description,
        userId: posts[index].userId //keep user id
    };

    res.status(200).json(posts[index]);
});

/*
    - delete post -
route: /post/delete/:id that you wanna delete
body: you don't need send
*/
app.delete('/post/delete/:id', (req, res) => {
    const { id } = req.params;

    const index = posts.findIndex(p => p.postId === Number(id)); //verify if this post exist

    if (index === -1) {
        return res.status(404).json({ error: 'Sorry, we cannot find this post id :(' });
    }

    posts.splice(index, 1); //remove id that you pass on params 

    res.status(204).send(); // send a response to who request
});

/*
    - select a specific id user and his posts -
route: /post/user/:id that you wanna see
body: you don't need send
*/
app.get('/post/user/:userId', (req, res) => {
    const userId = Number(req.params.userId);
    const userPosts = posts.filter(p => p.userId === userId); // create a array and put which index from posts {userId} that is equals to userId from params

    if (userPosts.length === 0) {
        return res.status(404).json({ error: 'any posts founded for this user' });
    }

    res.json(userPosts); // send a response to who request
});

/*
    - list every posts -
    route: /post/user/list
    body: you don't need send
*/
app.get('/post/list', (req, res) => { // list every posts
    res.json(posts);
});

app.listen(port, () => { //port is the door where server be
    console.log(`server loading on: http://localhost:${port}/`);
});
