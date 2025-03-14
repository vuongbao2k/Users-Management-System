package com.jabao.usersmanagementsystem.service;

import com.jabao.usersmanagementsystem.dto.ReqRes;
import com.jabao.usersmanagementsystem.entity.OurUsers;
import com.jabao.usersmanagementsystem.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UsersManagementService {

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ReqRes register(ReqRes registrationRequest) {
        ReqRes reqRes = new ReqRes();
        try {
            OurUsers ourUser = new OurUsers();
            ourUser.setEmail(registrationRequest.getEmail());
            ourUser.setCity(registrationRequest.getCity());
            ourUser.setRole(registrationRequest.getRole());
            ourUser.setName(registrationRequest.getName());
            ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            OurUsers ourUsersResult = usersRepo.save(ourUser);
            if (ourUsersResult.getId() > 0) {
                reqRes.setOurUsers(ourUsersResult);
                reqRes.setMessage("Successfully registered user");
                reqRes.setStatusCode(200);
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setError(e.getMessage());
        }
        return reqRes;
    }

    public ReqRes login(ReqRes loginRequest) {
        ReqRes reqRes = new ReqRes();
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
                            loginRequest.getPassword()));
            var user = usersRepo.findByEmail(loginRequest.getEmail()).orElseThrow();
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
            reqRes.setStatusCode(200);
            reqRes.setToken(jwt);
            reqRes.setRole(user.getRole());
            reqRes.setRefreshToken(refreshToken);
            reqRes.setExpirationTime("7Days");
            reqRes.setMessage("Successfully logged in");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setError(e.getMessage());
        }
        return reqRes;
    }

    public ReqRes refreshToken(ReqRes refreshTokenRequest) {
        ReqRes reqRes = new ReqRes();
        try {
            String ourEmail = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            OurUsers users = usersRepo.findByEmail(ourEmail).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                reqRes.setStatusCode(200);
                reqRes.setToken(jwt);
                reqRes.setRefreshToken(refreshTokenRequest.getToken());
                reqRes.setExpirationTime("7Days");
                reqRes.setMessage("Successfully refreshed token");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setError(e.getMessage());
            return reqRes;
        }
    }

    public ReqRes getAllUsers() {
        ReqRes reqRes = new ReqRes();
        try {
            List<OurUsers> results = usersRepo.findAll();
            if (!results.isEmpty()) {
                reqRes.setStatusCode(200);
                reqRes.setOurUsersList(results);
                reqRes.setMessage("Successfully retrieved all users");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("No users found");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setError(e.getMessage());
            return reqRes;
        }
    }

    public ReqRes getUserById(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            OurUsers ourUser = usersRepo.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));
            reqRes.setOurUsers(ourUser);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Successfully retrieved user with id " + id);
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setError(e.getMessage());
        }
        return reqRes;
    }

    public ReqRes deleteUser(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> usersOptional = usersRepo.findById(id);
            if (usersOptional.isPresent()) {
                usersRepo.deleteById(id);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successfully deleted user with id " + id);
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User Not Found");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setError(e.getMessage());
        }
        return reqRes;
    }

    public ReqRes updateUser(Integer userId, OurUsers updatedUser) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> usersOptional = usersRepo.findById(userId);
            if (usersOptional.isPresent()) {
                OurUsers existingUser = usersOptional.get();
                existingUser.setCity(updatedUser.getCity());
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setRole(updatedUser.getRole());
                existingUser.setName(updatedUser.getName());

                if (updatedUser.getPassword() != null && updatedUser.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                OurUsers savedUser = usersRepo.save(existingUser);
                reqRes.setOurUsers(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successfully updated user with id " + userId);
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User Not Found");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setError(e.getMessage());
        }
        return reqRes;
    }

    public ReqRes getMyInfo(String email) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> usersOptional = usersRepo.findByEmail(email);
            if (usersOptional.isPresent()) {
                reqRes.setOurUsers(usersOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User Not Found");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setError(e.getMessage());
        }
        return reqRes;
    }
}
