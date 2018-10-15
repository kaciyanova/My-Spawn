from random import randint

board = []
#board build
for x in range(5):
    board.append(["O"] * 5)

def print_board(board):
    for row in board:
        print " ".join(row)
#intro
print "Battleship time, motherfucker!"
print_board(board)

def random_row(board):
    return randint(0, len(board) - 1)

def random_col(board):
    return randint(0, len(board[0]) - 1)

ship_row = random_row(board)
ship_col = random_col(board)
#debug from here: 
#print ship_row
#print ship_col

#main bit
#edit tries here
tries=10
for turn in range(tries):
    guess_row = int(raw_input("Guess Row:"))
    guess_col = int(raw_input("Guess Col:"))
    
    if guess_row == ship_row and guess_col == ship_col:
        print "you FUCKER that's my SHIP"
        break
    else:
        if (guess_row < 0 or guess_row > 4) or (guess_col < 0 or guess_col > 4):
            print "that's not even in the ocean you ingrate"
        elif(board[guess_row][guess_col] == "X"):
            print "you guessed that one already????"
        else:
            print "haha you missed you waste of space"
            board[guess_row][guess_col] = "X"
        if turn==10:
           print'Game Over'
        print (tries-(turn+1)),' turns left'
        print_board(board)