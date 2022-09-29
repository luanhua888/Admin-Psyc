const waitTime = (time = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

export default {
    'GET /api/categories': (req, res) => {
        res.send({
            success: true,
            data: [
                {
                    id: '1',
                    name: 'Áo',
                },
                {
                    id: '2',
                    name: 'Quần',
                },
                {
                    id: '3',
                    name: 'Phụ Kiện',
                },
                {
                    id: '5',
                    name: 'Vòng Tay',
                },
                {
                    id: '6',
                    name: 'Nhẫn',
                },
                {
                    id: '1',
                    name: 'Thắt Lưng',
                },
                {
                    id: '1',
                    name: 'Dây Chuyền',
                },
            ]
        })
    } 
}