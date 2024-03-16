import React, { useState } from 'react';
import { Button, TextField, Container, Grid, Typography } from '@mui/material';
import axios from 'axios';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Kiểm tra nếu không có tên đăng nhập hoặc mật khẩu
        if (!username || !password) {
            setError('Vui lòng nhập tên đăng nhập và mật khẩu.');
            return;
        }
        
        try {
            console.log('Before axios post');
            const response = await axios.post('http://localhost:3000/auth/login', {
                username,
                password,
            });

            console.log(response.data.tokens[0].value);

            if (response.status === 201) {
                const redirectUri = new URLSearchParams(window.location.search).get('redirect_uri');
                // Chuyển hướng người dùng đến trang frontend khác với redirect URL nếu có
                if (redirectUri) {
                    const token = response.data.tokens[0].value;
                    window.location.href = `${redirectUri}?token=${token}`;
                } else {
                   console.log('Redirect to /');
                }
            } else if (response.status === 401) {
                setError('Tên đăng nhập hoặc mật khẩu không hợp lệ.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.');
        }
    };

    return (
        <Container maxWidth="xs">
            <div>
                <Typography variant="h4" align="center" gutterBottom>
                    Đăng nhập
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="username"
                                label="Tên đăng nhập"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="password"
                                label="Mật khẩu"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    {error && (
                        <Typography variant="body2" color="error" align="center" gutterBottom>
                            {error}
                        </Typography>
                    )}
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Đăng nhập
                    </Button>
                </form>
            </div>
        </Container>
    );
};

export default Login;
