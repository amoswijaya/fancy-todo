const {
  todo,
  User
} = require('../models/')
const axios = require('axios')


class TodoController {
  static add(req, res, next) {
    const {
      title,
      description,
      status,
      due_date
    } = req.body
    const data = {
      title,
      description,
      status,
      due_date,
      UserId: +req.decode.id
    }
    todo.create(data)
      .then((data) => {
        res.status(201).json(data)
      })
      .catch((err) => {
        console.log(err);
        next(err)
      })
  }

  static getTodos(req, res, next) {
    let dataTodo
    User.findOne({
        where: {
          id: req.decode.id
        },
        include: todo
      })
      .then(data => {
        dataTodo = data
        return axios.get('https://api.quotable.io/random')
      })
      .then((quote) => {
        res.status(200).json({quote: quote.data, todos: dataTodo.todos})
      }).catch((err) => {
        next(err)
      });
  }

  static getTodoById(req, res, next) {
    todo.findOne({
        where: {
          id: +req.params.id
        }
      })
      .then((data) => {
        console.log(data);
        if (!data) throw {
          name: 'customError',
          code: 404,
          msg: 'data not found'
        }
        res.status(200).json(data)
      }).catch((err) => {
        console.log(err);
        next(err)
      });
  }

  static edit(req, res, next) {
    const {
      title,
      descriiption,
      status,
      due_date
    } = req.body

    todo.findOne({
        where: {
          id: +req.params.id
        }
      })
      .then((data) => {
        if (!data) throw {
          name: 'customError',
          code: 404,
          msg: 'data not found'
        }
        return todo.update({
          title,
          descriiption,
          status,
          due_date
        }, {
          where: {
            id: +req.params.id
          }
        })

      })
      .then((data) => {
        res.status(200).json({
          message: 'Successfully update Todos'
        })
      }).catch((err) => {
        next(err)
      });
  }

  static editStatus(req, res, next) {
    todo.findOne({
        where: {
          id: +req.params.id
        }
      })
      .then((data) => {
        data.status = true
        return data.save()
      })
      .then((data) => {
        console.log(data);
        res.status(200).json(data)
      })
      .catch((err) => {
        next(err)
      })

  }

  static delete(req, res, next) {
    todo.destroy({
        where: {
          id: +req.params.id
        }
      })
      .then((data) => {
        res.status(200).json(data)
      }).catch((err) => {
        next(err)
      });
  }

  
}

module.exports = TodoController