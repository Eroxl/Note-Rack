#!/bin/bash

cp backend/.env.example backend/.env
cp web/src/.env.example web/src/.env.local

read -p "What is your text editor: " editor

$editor backend/.env
$editor web/src/.env.local