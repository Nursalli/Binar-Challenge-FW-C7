//Connect Models
const { sequelize, User_games, User_game_histories } = require('../models');

//Handler
const index = async (req, res) => {
    const page = 'Dashboard Page';
    const title = 'Dashboard';

    let data = await User_game_histories.findAll({
        attributes: [
            'id_user',
            [sequelize.fn('sum', sequelize.col('time')), 'time'],
            [sequelize.fn('sum', sequelize.col('score')), 'score'],
          ],
        group: ['id_user']
        });

    data = data.map(i => {
        return {
            id_user: i.id_user,
            time: i.time,
            score: parseInt(i.score)
        }
    });

    data.sort(function(a, b) { 
        return b.score - a.score;
    });

    //Join Table?
    // const data = await User_games.findAll({
    //     include: [{
    //       model: User_game_histories
    //      }]
    //   });
    // res.send(data);
      
    res.render('dashboard/index', {
        layout: 'dashboard/layouts/main',
        page,
        title,
        data
    });
}

module.exports = { index }